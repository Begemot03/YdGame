"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

cr.plugins_.YdGame = function (runtime) {
	this.runtime = runtime;
	this.ysdk = null;
};

(function () {
	let pluginProto = cr.plugins_.YdGame.prototype;

	let YD_TYPE = null;

	pluginProto.Type = function (plugin) {
		this.plugin = plugin;
		this.runtime = plugin.runtime;
		YD_TYPE = this;
	};

	let typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function () {};

	pluginProto.Instance = function (type) {
		this.type = type;
		this.runtime = type.runtime;
	};

	let instanceProto = pluginProto.Instance.prototype;

	pluginProto.__sdkInitInProgress = false;
	pluginProto.__sdkReady = false;
	pluginProto.__sdkError = null;

	instanceProto.onCreate = function () {
		this.canShowFullscreenAdv = true;
		this.canGetLeaderboardEntries = true;
		this.leaderboardEntriesGettingCounter = 0;
		this.playerRecord = {};
		this.leaderboardEntries = {};
		window.player = {};
		this.playerIsAuth = false;
		this.playerPayingStatus = "unknown";
		this.playerName = "";
		this.isPlayerFullDataGetted = false;

		// Cloud Data
		this.cachedData = {};
		this.cachedStats = {};
		this.lastError = "";

		this.cloudDataCooldownMs = 5000;
		this.cloudDataOnCooldown = false;
		this.cloudStatsCooldownMs = 1000;
		this.cloudStatsOnCooldown = false;

		// Purchases
		this.lastPurchaseError = "";
		this.payments = null;
		this.cachedPurchases = [];
		this.cachedCatalog = [];
		this.purchasesCooldown = false;
		this.catalogCooldown = false;
		this.purchasesCooldownDelay = 10 * 1000;
		this.catalogCooldownDelay = 10 * 1000;

		// Review
		this.lastReviewReason = "";
		this.lastReviewError = "";
		this.lastFeedbackSent = 0;

		if (!pluginProto.__sdkInitInProgress && !pluginProto.__sdkReady) {
			pluginProto.__sdkInitInProgress = true;
			initSdk.call(this);
		}
	};

	async function initSdk() {
		const inst = this; // тот самый первый Instance
		const runtime = inst.runtime;

		if (typeof YaGames === "undefined") {
			pluginProto.__sdkError = "YaGames SDK not found";
			broadcastTrigger("OnSDKInitFailed");
			return;
		}

		try {
			window.ysdk = await YaGames.init();
			console.log(window.ysdk);
			pluginProto.__sdkReady = true;

			try {
				window.flags = await window.ysdk.getFlags();
			} catch (e) {}

			window.player = await window.ysdk.getPlayer({ scopes: true });
			inst.playerIsAuth = window.player.getMode() !== "lite";

			if (window.ysdk.features.LoadingAPI?.ready)
				window.ysdk.features.LoadingAPI.ready();

			broadcastTrigger("OnSDKInitialized");
		} catch (err) {
			pluginProto.__sdkError = err;
			console.log(err);
			broadcastTrigger("OnSDKInitFailed");
		} finally {
			pluginProto.__sdkInitInProgress = false;
		}

		/* -------- helper ---------- */
		function broadcastTrigger(condName) {
			// пробегаемся по всем существующим экземплярам YdGame
			const type = YD_TYPE;
			if (!type) return;
			for (let i = 0; i < type.instances.length; i++) {
				runtime.trigger(
					cr.plugins_.YdGame.prototype.cnds[condName],
					type.instances[i]
				); // ← контекст = instance!
			}
		}
	}

	instanceProto.fullScreenTimer = function () {
		if (!this.canShowFullscreenAdv) return;

		this.canShowFullscreenAdv = false;

		setTimeout(() => {
			this.canShowFullscreenAdv = true;
		}, 60 * 1000);
	};

	instanceProto.leaderboardEntriesTimer = function () {
		if (!this.canGetLeaderboardEntries) return;

		this.canGetLeaderboardEntries = false;

		setTimeout(() => {
			this.canGetLeaderboardEntries = true;
			this.leaderboardEntriesGettingCounter = 0;
		}, 60 * 1000 * 5);
	};

	instanceProto.performDataCloudOp = function (operationFn) {
		if (this.cloudDataOnCooldown) {
			console.log("[Cloud] Operation skipped (throttle).");
			return;
		}

		// Устанавливаем флаг
		this.cloudDataOnCooldown = true;

		// После 5 секунд можно снова
		let self = this;
		setTimeout(function () {
			self.cloudDataOnCooldown = false;
		}, this.cloudDataCooldownMs);

		// Выполняем операцию
		operationFn();
	};

	instanceProto.performStatsCloudOp = function (operationFn) {
		if (this.cloudStatsOnCooldown) {
			console.log("[Cloud] Operation skipped (throttle).");
			return;
		}

		// Устанавливаем флаг
		this.cloudStatsOnCooldown = true;

		// После 1 секунд можно снова
		let self = this;
		setTimeout(function () {
			self.cloudStatsOnCooldown = false;
		}, this.cloudStatsCooldownMs);

		// Выполняем операцию
		operationFn();
	};

	instanceProto.startPurchasesCooldown = function () {
		let self = this;
		this.purchasesCooldown = true;
		setTimeout(function () {
			self.purchasesCooldown = false;
		}, this.purchasesCooldownDelay);
	};

	instanceProto.startCatalogCooldown = function () {
		let self = this;
		this.catalogCooldown = true;
		setTimeout(function () {
			self.catalogCooldown = false;
		}, this.catalogCooldownDelay);
	};

	///////////////////////////////////////////////////////
	//// Conditions
	function Cnds() {}
	pluginProto.cnds = new Cnds();

	// Any Adv
	Cnds.prototype.OnAdvOpened = function () {
		return true;
	};

	Cnds.prototype.OnAdvClosed = function () {
		return true;
	};

	// Fullscreen
	Cnds.prototype.CanShowFullscreenAdv = function () {
		return this.canShowFullscreenAdv;
	};

	Cnds.prototype.OnFullscreenAdvOpened = function () {
		return true;
	};

	Cnds.prototype.OnFullscreenAdvClosed = function () {
		this.fullScreenTimer();
		return true;
	};

	Cnds.prototype.OnFullscreenAdvError = function () {
		this.fullScreenTimer();
		return true;
	};

	// Reward Adv
	Cnds.prototype.OnRewardAdvOpened = function () {
		return true;
	};

	Cnds.prototype.OnRewardAdvClosed = function () {
		return true;
	};

	Cnds.prototype.OnRewardAdvError = function () {
		return true;
	};

	Cnds.prototype.OnRewarded = function () {
		return true;
	};

	// Leaderboard
	Cnds.prototype.OnPlayerRecordUpdated = function () {
		return true;
	};

	Cnds.prototype.OnLeaderboardError = function () {
		return true;
	};

	Cnds.prototype.OnLeaderboardEntriesGetted = function () {
		return true;
	};

	Cnds.prototype.OnPlayerRecordGetted = function () {
		return true;
	};

	// Player Data
	Cnds.prototype.OnPlayerAuth = function () {
		return true;
	};

	// Environment Data
	Cnds.prototype.HasEnvironmentData = function () {
		return !!window.ysdk?.environment;
	};

	Cnds.prototype.HasPayload = function () {
		const environment = window.ysdk?.environment;
		return !!environment && !!environment.payload;
	};

	// Cloud Data
	Cnds.prototype.OnCloudDataUpdatedSuccess = function () {
		return true;
	};

	Cnds.prototype.OnCloudStatsUpdatedSuccess = function () {
		return true;
	};

	Cnds.prototype.OnCloudError = function () {
		return true;
	};

	Cnds.prototype.OnCloudStatsGetted = function () {
		return true;
	};

	Cnds.prototype.OnCloudDataGetted = function () {
		return true;
	};

	// Purchases
	Cnds.prototype.OnPurchaseSuccess = function () {
		return true;
	};

	Cnds.prototype.OnPurchaseError = function () {
		return true;
	};

	Cnds.prototype.OnGetPurchasesSuccess = function () {
		return true;
	};

	Cnds.prototype.OnGetCatalogSuccess = function () {
		return true;
	};

	Cnds.prototype.OnPurchasesInit = function () {
		return true;
	};

	// Review
	Cnds.prototype.OnCanReviewYes = function () {
		return true;
	};

	Cnds.prototype.OnCanReviewNo = function () {
		return true;
	};

	Cnds.prototype.OnRequestReviewComplete = function () {
		return true;
	};

	///////////////////////////////////////////////////////
	//// Actions
	function Acts() {}
	pluginProto.acts = new Acts();

	// Fullscreen
	Acts.prototype.ShowFullScreenAdv = function () {
		if (!window.ysdk || !this.canShowFullscreenAdv) return;
		let self = this;

		console.log(window.ysdk.adv);

		window.ysdk.adv.showFullscreenAdv({
			callbacks: {
				onOpen: function () {
					self.runtime.trigger(pluginProto.cnds.OnAdvOpened, self);
					self.runtime.trigger(pluginProto.cnds.OnFullscreenAdvOpened, self);
				},
				onClose: function (wasShown) {
					self.lastFullscreenShowed = wasShown;
					self.runtime.trigger(pluginProto.cnds.OnAdvClosed, self);
					self.runtime.trigger(pluginProto.cnds.OnFullscreenAdvClosed, self);
				},
				onError: function (err) {
					self.lastFullscreenError = err;
					self.runtime.trigger(pluginProto.cnds.OnFullscreenAdvError, self);
				},
			},
		});
	};

	// Reward Adv
	Acts.prototype.ShowRewardAdv = function (rewardId) {
		if (!window.ysdk) return;
		let self = this;

		window.ysdk.adv.showRewardedVideo({
			callbacks: {
				onOpen: () => {
					self.runtime.trigger(pluginProto.cnds.OnAdvOpened, self);
					self.runtime.trigger(pluginProto.cnds.OnRewardAdvOpened, self);
				},
				onRewarded: () => {
					self.lastRewardId = rewardId;
					self.runtime.trigger(pluginProto.cnds.OnRewarded, self);
				},
				onClose: () => {
					self.runtime.trigger(pluginProto.cnds.OnAdvClosed, self);
					self.runtime.trigger(pluginProto.cnds.OnRewardAdvClosed, self);
				},
				onError: (err) => {
					self.lastRewardError = err;
					self.runtime.trigger(pluginProto.cnds.OnRewardAdvError, self);
				},
			},
		});
	};

	// Leaderboard
	Acts.prototype.UpdateLeaderboardRecord = function (lbName, newVal) {
		if (!window.ysdk) return;
		let self = this;

		window.ysdk
			.getLeaderboards()
			.then((lb) => {
				lb.setLeaderboardScore(lbName, newVal | 0);
				self.runtime.trigger(pluginProto.cnds.OnPlayerRecordUpdated, self);
			})
			.catch((err) => {
				self.runtime.trigger(pluginProto.cnds.OnLeaderboardError, self);
			});
	};

	Acts.prototype.GetPlayerRecordInLeanderboard = function (lbName) {
		if (!window.ysdk) return;
		let self = this;

		window.ysdk
			.getLeaderboards()
			.then((lb) => lb.getLeaderboardPlayerEntry(lbName))
			.then((res) => {
				self.playerRecord[lbName] = res;
				self.runtime.trigger(pluginProto.cnds.OnPlayerRecordGetted, self);
			})
			.catch((err) => {
				if (err.code === "LEADERBOARD_PLAYER_NOT_PRESENT") {
					self.runtime.trigger(pluginProto.cnds.OnLeaderboardError, self);
				}
			});
	};

	Acts.prototype.GetLeaderboardEntriesWithPlayer = function (lbName, qt, qa) {
		if (!window.ysdk || !this.canGetLeaderboardEntries) return;
		let self = this;

		this.leaderboardEntriesGettingCounter++;
		if (this.leaderboardEntriesGettingCounter >= 21) {
			this.leaderboardEntriesTimer();
			return;
		}

		window.ysdk
			.getLeaderboards()
			.then((lb) =>
				lb.getLeaderboardEntries(lbName, {
					quantityTop: qt,
					includeUser: true,
					quantityAround: qa,
				})
			)
			.then((res) => {
				self.leaderboardEntries[lbName] = res;
				self.runtime.trigger(pluginProto.cnds.OnLeaderboardEntriesGetted, self);
			})
			.catch((err) => {
				self.runtime.trigger(pluginProto.cnds.OnLeaderboardError, self);
			});
	};

	Acts.prototype.GetLeaderboardEntries = function (lbName, qt) {
		if (!window.ysdk || !this.canGetLeaderboardEntries) return;
		let self = this;

		this.leaderboardEntriesGettingCounter++;
		if (this.leaderboardEntriesGettingCounter >= 21) {
			this.leaderboardEntriesTimer();
			return;
		}

		window.ysdk
			.getLeaderboards()
			.then((lb) =>
				lb.getLeaderboardEntries(lbName, {
					quantityTop: qt,
				})
			)
			.then((res) => {
				self.leaderboardEntries[lbName] = res;
				self.runtime.trigger(pluginProto.cnds.OnLeaderboardEntriesGetted, self);
			})
			.catch((err) => {
				self.runtime.trigger(pluginProto.cnds.OnLeaderboardError, self);
			});
	};

	// Player Data
	Acts.prototype.AuthPlayer = async function () {
		this.player = await window.ysdk.getPlayer({ scopes: true });
		window.player = this.player; // <-- ВАЖНО
		this.isPlayerFullDataGetted = true;

		this.playerName = this.player.getName();
		this.playerPayingStatus = this.player.getPayingStatus();
		this.playerIsAuth = true;

		this.runtime.trigger(pluginProto.cnds.OnPlayerAuth, this);
	};

	// Cloud Data
	Acts.prototype.SetCloudData = function (key, value) {
		this.cachedData[key] = value;
		let self = this;

		if (!player) {
			this.lastError = "[SetCloudData] player not ready";
			return;
		}

		this.performDataCloudOp(() => {
			if (!window.ysdk) {
				console.log("[SetCloudData] No ysdk player. Operation canceled.");
				return;
			}
			window.player
				.setData(self.cachedData, false)
				.then(() => {
					self.runtime.trigger(
						pluginProto.cnds.OnCloudDataUpdatedSuccess,
						self
					);
				})
				.catch((err) => {
					self.lastError = err;
					self.runtime.trigger(pluginProto.cnds.OnCloudError, self);
				});
		});
	};

	Acts.prototype.GetCloudData = function (key) {
		let self = this;

		if (self.cloudDataOnCooldown) {
			self.runtime.trigger(pluginProto.cnds.OnCloudDataGetted, self);
			return;
		}

		this.performDataCloudOp(() => {
			if (!window.ysdk) {
				console.log("[GetCloudData] No ysdk player. Operation canceled.");
				return;
			}
			const param = key.trim() === "" ? undefined : [key];

			if (param) {
				window.player
					.getData(param)
					.then((result) => {
						Object.keys(result).forEach((k) => {
							self.cachedData[k] = result[k];
						});
						self.runtime.trigger(pluginProto.cnds.OnCloudDataGetted, self);
					})
					.catch((err) => {
						self.lastError = "[GetData] " + err;
						self.runtime.trigger(pluginProto.cnds.OnCloudError, self);
					});
			} else {
				window.player
					.getData()
					.then((result) => {
						Object.keys(result).forEach((k) => {
							self.cachedData[k] = result[k];
						});
						self.runtime.trigger(pluginProto.cnds.OnCloudDataGetted, self);
					})
					.catch((err) => {
						self.lastError = "[GetData] " + err;
						self.runtime.trigger(pluginProto.cnds.OnCloudError, self);
					});
			}
		});
	};

	Acts.prototype.GetCloudStats = function (key) {
		let self = this;

		if (self.cloudStatsOnCooldown) {
			self.runtime.trigger(pluginProto.cnds.OnCloudStatsGetted, self);
			return;
		}

		this.performStatsCloudOp(() => {
			if (!window.ysdk) {
				console.log("[GetCloudStats] No ysdk player. Operation canceled.");
				return;
			}
			const param = key.trim() === "" ? undefined : [key];

			if (param) {
				window.player
					.getStats(param)
					.then((statsObj) => {
						Object.keys(statsObj).forEach((k) => {
							self.cachedStats[k] = statsObj[k];
						});
						self.runtime.trigger(pluginProto.cnds.OnCloudStatsGetted, self);
					})
					.catch((err) => {
						self.lastError = "[GetStats] " + err;
						self.runtime.trigger(pluginProto.cnds.OnCloudError, self);
					});
			} else {
				window.player
					.getStats()
					.then((statsObj) => {
						Object.keys(statsObj).forEach((k) => {
							self.cachedStats[k] = statsObj[k];
						});
						self.runtime.trigger(pluginProto.cnds.OnCloudStatsGetted, self);
					})
					.catch((err) => {
						self.lastError = "[GetStats] " + err;
						self.runtime.trigger(pluginProto.cnds.OnCloudError, self);
					});
			}
		});
	};

	Acts.prototype.SetCloudStats = function (key, numValue) {
		this.cachedStats[key] = numValue;

		let self = this;
		this.performStatsCloudOp(() => {
			if (!window.ysdk) {
				console.log("[SetCloudStats] No ysdk player. Operation canceled.");
				return;
			}
			window.player
				.setStats(self.cachedStats)
				.then(() => {
					self.runtime.trigger(
						pluginProto.cnds.OnCloudStatsUpdatedSuccess,
						self
					);
				})
				.catch((err) => {
					self.lastError = err;
					self.runtime.trigger(pluginProto.cnds.OnCloudError, self);
				});
		});
	};

	// Purchases
	Acts.prototype.InitPurchases = function (signedMode) {
		let signed = signedMode === 1;
		if (!window.ysdk) {
			this.lastPurchaseError = "[InitPurchases] No ysdk available";
			return;
		}
		let self = this;
		window.ysdk
			.getPayments({ signed })
			.then((_payments) => {
				self.payments = _payments;
				self.runtime.trigger(pluginProto.cnds.OnPurchasesInit, self);
			})
			.catch((err) => {
				self.lastPurchaseError = "[InitPurchases] " + err;
			});
	};

	Acts.prototype.Purchase = function (productId, devPayload) {
		if (!this.payments) {
			this.lastPurchaseError = "[Purchase] payments not inited";
			this.runtime.trigger(pluginProto.cnds.OnPurchaseError, this);
			return;
		}
		let self = this;
		this.payments
			.purchase({ id: productId, developerPayload: devPayload })
			.then((purchase) => {
				self.lastPurchaseError = "";
				self.lastPurchaseProductId = purchase.productID;
				self.lastPurchaseToken = purchase.purchaseToken;
				self.lastPurchasePayload = purchase.developerPayload;
				self.runtime.trigger(pluginProto.cnds.OnPurchaseSuccess, self);
			})
			.catch((err) => {
				self.lastPurchaseError = "[PurchaseError] " + err;
				self.runtime.trigger(pluginProto.cnds.OnPurchaseError, self);
			});
	};

	Acts.prototype.GetPurchases = function () {
		if (!this.payments) {
			this.lastPurchaseError = "[GetPurchases] not inited";
			return;
		}
		if (this.purchasesCooldown) {
			this.lastPurchaseError = "[GetPurchases] cooldown in progress";
			return;
		}
		this.startPurchasesCooldown();

		let self = this;
		this.payments
			.getPurchases()
			.then((purchases) => {
				self.cachedPurchases = purchases;
				self.runtime.trigger(pluginProto.cnds.OnGetPurchasesSuccess, self);
			})
			.catch((err) => {
				self.lastPurchaseError = "[GetPurchases error] " + err;
				self.runtime.trigger(pluginProto.cnds.OnPurchaseError, self);
			});
	};

	Acts.prototype.ConsumePurchase = function (token) {
		if (!this.payments) {
			this.lastPurchaseError = "[ConsumePurchase] not inited";
			return;
		}
		let self = this;
		this.payments
			.consumePurchase(token)
			.then(() => {
				// Успешно
				// если нужно, можно удалить из cachedPurchases
				self.cachedPurchases = self.cachedPurchases.filter(
					(p) => p.purchaseToken !== token
				);
			})
			.catch((err) => {
				self.lastPurchaseError = "[ConsumePurchase error] " + err;
				self.runtime.trigger(pluginProto.cnds.OnPurchaseError, self);
			});
	};

	Acts.prototype.GetCatalog = function () {
		if (!this.payments) {
			this.lastPurchaseError = "[GetCatalog] not inited";
			return;
		}
		if (this.catalogCooldown) {
			this.lastPurchaseError = "[GetCatalog] cooldown in progress";
			return;
		}
		this.startCatalogCooldown();

		let self = this;
		this.payments
			.getCatalog()
			.then((products) => {
				self.cachedCatalog = products;
				self.runtime.trigger(pluginProto.cnds.OnGetCatalogSuccess, self);
			})
			.catch((err) => {
				self.lastPurchaseError = "[GetCatalog error] " + err;
				self.runtime.trigger(pluginProto.cnds.OnPurchaseError, self);
			});
	};

	// Review
	Acts.prototype.CheckCanReview = function () {
		if (!window.ysdk) {
			this.lastReviewError = "[CheckCanReview] No feedback object in ysdk";
			// Считаем это "no"
			this.lastReviewReason = "UNKNOWN";
			this.runtime.trigger(pluginProto.cnds.OnCanReviewNo, this);
			return;
		}
		let self = this;
		window.ysdk.feedback
			.canReview()
			.then(({ value, reason }) => {
				// value = true/false
				// reason = string, e.g. NO_AUTH, GAME_RATED, ...
				self.lastReviewError = "";
				if (value) {
					self.lastReviewReason = ""; // no reason
					self.runtime.trigger(pluginProto.cnds.OnCanReviewYes, self);
				} else {
					self.lastReviewReason = reason || "UNKNOWN";
					self.runtime.trigger(pluginProto.cnds.OnCanReviewNo, self);
				}
			})
			.catch((err) => {
				// Непредвиденная ошибка
				self.lastReviewError = "[CheckCanReview] " + err;
				self.lastReviewReason = "UNKNOWN";
				// По логике, раз ошибка -> user can't review
				self.runtime.trigger(pluginProto.cnds.OnCanReviewNo, self);
			});
	};

	Acts.prototype.RequestReview = function () {
		if (!window.ysdk) {
			this.lastReviewError = "[RequestReview] No feedback object in ysdk";
			// Можно сразу триггерить "OnRequestReviewComplete", feedbackSent=false
			this.lastFeedbackSent = 0;
			this.runtime.trigger(pluginProto.cnds.OnRequestReviewComplete, this);
			return;
		}
		let self = this;
		window.ysdk.feedback
			.requestReview()
			.then(({ feedbackSent }) => {
				// feedbackSent = true (поставил оценку) / false (закрыл окно)
				self.lastReviewError = "";
				self.lastFeedbackSent = feedbackSent ? 1 : 0;
				self.runtime.trigger(pluginProto.cnds.OnRequestReviewComplete, self);
			})
			.catch((err) => {
				// Если requestReview выдает ошибку (возможно "use canReview before requestReview", etc.)
				self.lastReviewError = "[RequestReview] " + err;
				self.lastFeedbackSent = 0;
				self.runtime.trigger(pluginProto.cnds.OnRequestReviewComplete, self);
			});
	};

	///////////////////////////////////////////////////////
	//// Expressions
	function Exps() {}
	pluginProto.exps = new Exps();

	// Fullscreen
	Exps.prototype.IsLastFullscreenAdvShowed = function (ret) {
		let lastAdvShowed = this.lastFullscreenShowed ? 1 : 0;
		ret.set_int(lastAdvShowed);
	};

	Exps.prototype.LastFullscreenAdvError = function (ret) {
		let lastAdvError =
			this.lastFullscreenError == undefined ? "" : this.lastFullscreenError;
		ret.set_string(lastAdvError);
	};

	// Reward Adv
	Exps.prototype.LastRewardId = function (ret) {
		let lasId = this.lastRewardId == undefined ? "" : this.lastRewardId;
		ret.set_string(lasId);
	};

	Exps.prototype.LastRewardError = function (ret) {
		let lastError =
			this.lastRewardError == undefined ? "" : this.lastRewardError;
		ret.set_string(lastError);
	};

	// Leaderboard
	Exps.prototype.LeaderboardPlayerRecord = function (ret, lbName) {
		const record =
			this.playerRecord[lbName] && this.playerRecord[lbName].score
				? this.playerRecord[lbName].score
				: 0;
		ret.set_int(record);
	};

	Exps.prototype.HasLeaderboardEntries = function (ret, lbName) {
		ret.set_int(!this.leaderboardEntries[lbName] ? 0 : 1);
	};

	Exps.prototype.GetLeaderboardEntriesLength = function (ret, lbName) {
		ret.set_int(
			!this.leaderboardEntries[lbName]
				? 0
				: this.leaderboardEntries[lbName].entries.length
		);
	};

	Exps.prototype.GetPlayerNameInLeaderboardEntries = function (
		ret,
		lbName,
		id
	) {
		let playerName =
			!this.leaderboardEntries[lbName] ||
			!this.leaderboardEntries[lbName].entries[id]
				? ""
				: this.leaderboardEntries[lbName].entries[id].player.publicName;

		ret.set_string(playerName);
	};

	Exps.prototype.GetPlayerScoreInLeaderboardEntries = function (
		ret,
		lbName,
		id
	) {
		let playerScore =
			!this.leaderboardEntries[lbName] ||
			!this.leaderboardEntries[lbName].entries[id]
				? 0
				: this.leaderboardEntries[lbName].entries[id].score;

		ret.set_int(playerScore);
	};

	// Player Data
	Exps.prototype.PlayerName = function (ret) {
		ret.set_string(this.playerName || "");
	};

	Exps.prototype.PlayerPayingStatus = function (ret) {
		ret.set_string(this.playerPayingStatus || "");
	};

	Exps.prototype.PlayerIsAuth = function (ret) {
		ret.set_int(this.playerIsAuth ? 1 : 0);
	};

	Exps.prototype.PlayerId = function (ret) {
		if (window.player && typeof window.player.getUniqueID === "function") {
			ret.set_string(window.player.getUniqueID());
		} else {
			ret.set_string("");
		}
	};

	// Environment Data
	Exps.prototype.IsEnvironmentLoaded = function (ret) {
		ret.set_int(window.ysdk.environment ? 1 : 0);
	};

	Exps.prototype.IsMobile = function (ret) {
		if (
			window.ysdk &&
			window.ysdk.deviceInfo &&
			window.ysdk.deviceInfo.isMobile()
		)
			ret.set_int(1);
		else ret.set_int(0);
	};

	Exps.prototype.IsTablet = function (ret) {
		if (
			window.ysdk &&
			window.ysdk.deviceInfo &&
			window.ysdk.deviceInfo.isTablet()
		)
			ret.set_int(1);
		else ret.set_int(0);
	};

	Exps.prototype.IsDesktop = function (ret) {
		if (
			window.ysdk &&
			window.ysdk.deviceInfo &&
			window.ysdk.deviceInfo.isDesktop()
		)
			ret.set_int(1);
		else ret.set_int(0);
	};

	Exps.prototype.IsTV = function (ret) {
		if (window.ysdk && window.ysdk.deviceInfo && window.ysdk.deviceInfo.isTV())
			ret.set_int(1);
		else ret.set_int(0);
	};

	Exps.prototype.AppId = function (ret) {
		if (window.ysdk.environment == undefined) {
			ret.set_string("");
			return;
		}

		ret.set_string(window.ysdk.environment.app.id);
	};

	Exps.prototype.Lang = function (ret) {
		if (window.ysdk.environment == undefined) {
			ret.set_string("");
			return;
		}

		ret.set_string(window.ysdk.environment.i18n.lang);
	};

	Exps.prototype.Payload = function (ret) {
		if (
			window.ysdk.environment == undefined ||
			window.ysdk.environment.payload == undefined
		) {
			ret.set_string("");
			return;
		}

		ret.set_string(window.ysdk.environment.payload);
	};

	// Flag
	Exps.prototype.FlagValue = function (ret, flagName) {
		const flagValue = window.flags[flagName];
		ret.set_string(flagValue == undefined ? "" : flagValue);
	};

	// Cload Data
	Exps.prototype.CloudDataValue = function (ret, key) {
		let val = this.cachedData[key];
		ret.set_string(val === undefined ? "" : String(val));
	};

	Exps.prototype.CloudStatsValue = function (ret, key) {
		let val = this.cachedStats[key];
		if (val === undefined) val = 0;
		ret.set_int(val);
	};

	Exps.prototype.LastCloudError = function (ret) {
		ret.set_string(this.lastError.toString() || "");
	};

	Exps.prototype.CloudDataExists = function (ret, key) {
		if (typeof key !== "string" || key.trim() === "") {
			ret.set_int(0); // Пустой ключ всегда считается отсутствующим
			return;
		}
		let exists = Object.prototype.hasOwnProperty.call(this.cachedData, key);
		ret.set_int(exists ? 1 : 0);
	};

	Exps.prototype.CloudStatsExists = function (ret, key) {
		if (typeof key !== "string" || key.trim() === "") {
			ret.set_int(0); // Пустой ключ всегда считается отсутствующим
			return;
		}
		let exists = Object.prototype.hasOwnProperty.call(this.cachedStats, key);
		ret.set_int(exists ? 1 : 0);
	};

	// Purchases
	Exps.prototype.LastPurchaseError = function (ret) {
		ret.set_string(this.lastPurchaseError || "");
	};

	Exps.prototype.LastPurchaseProductId = function (ret) {
		ret.set_string(this.lastPurchaseProductId || "");
	};

	Exps.prototype.LastPurchaseToken = function (ret) {
		ret.set_string(this.lastPurchaseToken || "");
	};

	Exps.prototype.PurchasesCount = function (ret) {
		ret.set_int(this.cachedPurchases.length);
	};

	Exps.prototype.PurchaseProductId = function (ret, index) {
		index = Math.floor(index);
		if (index < 0 || index >= this.cachedPurchases.length) {
			ret.set_string("");
			return;
		}
		ret.set_string(this.cachedPurchases[index].productID);
	};

	Exps.prototype.PurchaseToken = function (ret, index) {
		index = Math.floor(index);
		if (index < 0 || index >= this.cachedPurchases.length) {
			ret.set_string("");
			return;
		}
		ret.set_string(this.cachedPurchases[index].purchaseToken);
	};

	Exps.prototype.CatalogCount = function (ret) {
		ret.set_int(this.cachedCatalog.length);
	};

	Exps.prototype.CatalogProductId = function (ret, index) {
		index = Math.floor(index);
		if (index < 0 || index >= this.cachedCatalog.length) {
			ret.set_string("");
			return;
		}
		ret.set_string(this.cachedCatalog[index].id);
	};

	Exps.prototype.CatalogProductPrice = function (ret, index) {
		index = Math.floor(index);
		if (index < 0 || index >= this.cachedCatalog.length) {
			ret.set_string("");
			return;
		}
		ret.set_string(this.cachedCatalog[index].price || "");
	};

	Exps.prototype.CatalogProductTitle = function (ret, index) {
		index = Math.floor(index);
		if (index < 0 || index >= this.cachedCatalog.length) {
			ret.set_string("");
			return;
		}
		ret.set_string(this.cachedCatalog[index].title || "");
	};

	Exps.prototype.CatalogProductDescription = function (ret, index) {
		index = Math.floor(index);
		if (index < 0 || index >= this.cachedCatalog.length) {
			ret.set_string("");
			return;
		}
		ret.set_string(this.cachedCatalog[index].description || "");
	};

	Exps.prototype.CatalogProductCurrencyImage = function (ret, index, size) {
		index = Math.floor(index);
		if (index < 0 || index >= this.cachedCatalog.length) {
			ret.set_string("");
			return;
		}

		const product = this.cachedCatalog[index];

		if (!product || typeof product.getPriceCurrencyImage !== "function") {
			ret.set_string("");
			return;
		}

		size = (size || "small").trim().toLowerCase();

		const url = product.getPriceCurrencyImage(size);

		ret.set_string(url || "");
	};

	// Review
	Exps.prototype.LastReviewReason = function (ret) {
		ret.set_string(this.lastReviewReason || "");
	};

	Exps.prototype.LastReviewError = function (ret) {
		ret.set_string(this.lastReviewError || "");
	};

	Exps.prototype.LastFeedbackSent = function (ret) {
		ret.set_int(this.lastFeedbackSent || 0);
	};

	Cnds.prototype.OnSDKInitialized = function () {
		return true;
	};

	Cnds.prototype.OnSDKInitFailed = function () {
		return true;
	};

	// В раздел Expressions добавим
	Exps.prototype.IsSDKInitialized = function (ret) {
		ret.set_int(this.type.plugin.sdkInitialized ? 1 : 0);
	};

	Exps.prototype.LastSDKInitError = function (ret) {
		ret.set_string(this.type.plugin.sdkInitError || "");
	};
})();
