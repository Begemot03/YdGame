if (window.ysdk) {
	console.log("[TestYSDK] Реальный YSDK найден, не используем заглушку.");
} else {
	console.log("[TestYSDK] YSDK не найден. Используем тестовую заглушку!");

	const YaGames = {
		init: () => {
			console.log("[TestYSDK] init()");
			return new Promise((resolve) => {
				// Имитируем асинхронную инициализацию
				resolve({
					environment: {
						app: { id: "test-app-id" },
						i18n: { lang: "ru" },
						payload: "test_payload",
					},
					deviceInfo: {
						isMobile: () => false,
						isTablet: () => false,
						isDesktop: () => true,
						isTV: () => false,
					},
					features: {
						LoadingAPI: {
							ready: () => {
								console.log("[TestYSDK] LoadingAPI.ready() заглушка");
							},
						},
					},

					// Тестовые флаги
					getFlags: async () => {
						console.log("[TestYSDK] getFlags() заглушка");
						return {
							"test-flag": "1000",
						};
					},

					// «Игрок»
					getPlayer: async (opts) => {
						console.log("[TestYSDK] getPlayer() заглушка, opts=", opts);
						return {
							// Локальное «хранилище»
							__localData: {},
							__localStats: {},

							setData: async function (dataObj, flush) {
								console.log(
									"[TestYSDK] player.setData() заглушка, data=",
									dataObj,
									"flush=",
									flush
								);
								for (const k in dataObj) {
									this.__localData[k] = dataObj[k];
								}
								console.log(this.__localData);
							},
							getData: async function (keys) {
								console.log(
									"[TestYSDK] player.getData() заглушка, keys=",
									keys
								);
								console.log(this.__localData);
								if (!keys) {
									// вернуть все
									return { ...this.__localData };
								} else {
									let result = {};
									keys.forEach((k) => {
										if (this.__localData.hasOwnProperty(k)) {
											result[k] = this.__localData[k];
										}
									});
									return result;
								}
							},
							setStats: async function (statsObj) {
								console.log(
									"[TestYSDK] player.setStats() заглушка, stats=",
									statsObj
								);
								for (const k in statsObj) {
									this.__localStats[k] = statsObj[k];
								}
								console.log(this.__localStats);
							},
							getStats: async function (keys) {
								console.log(
									"[TestYSDK] player.getStats() заглушка, keys=",
									keys
								);
								console.log(this.__localStats);
								if (!keys) {
									return { ...this.__localStats };
								} else {
									let result = {};
									keys.forEach((k) => {
										if (this.__localStats.hasOwnProperty(k)) {
											result[k] = this.__localStats[k];
										}
									});
									return result;
								}
							},
							incrementStats: async function (increments) {
								console.log(
									"[TestYSDK] player.incrementStats() заглушка, increments=",
									increments
								);
								console.log(this.__localStats);
								let updated = {};
								for (const k in increments) {
									let oldVal = this.__localStats[k] || 0;
									let incVal = increments[k];
									let newVal = oldVal + incVal;
									this.__localStats[k] = newVal;
									updated[k] = newVal;
								}
								return updated;
							},
							getMode: () => (opts.scopes ? "regular" : "lite"),
							getName: () => "LocalTester",
							getUniqueID: () => "local-uid-12345",
							getPayingStatus: () => "non_pay", // pay / non_pay / unknown
						};
					},

					// Реклама
					adv: {
						showFullscreenAdv: (opts) => {
							console.log("[TestYSDK] adv.showFullscreenAd() заглушка");
							if (opts?.callbacks) {
								opts.callbacks.onOpen?.();
								setTimeout(() => {
									// Считаем, что закрыл
									opts.callbacks.onClose?.(true);
								}, 1000);
							}
						},
						showRewardedVideo: (opts) => {
							console.log("[TestYSDK] adv.showRewardedVideo() заглушка");
							if (opts?.callbacks) {
								opts.callbacks.onOpen?.();
								setTimeout(() => {
									// Считаем, что досмотрено
									opts.callbacks.onRewarded?.();
									opts.callbacks.onClose?.();
								}, 2000);
							}
						},
					},

					// Лидерборды (Leaderboard)
					getLeaderboards: async () => {
						console.log("[TestYSDK] getLeaderboards() заглушка");
						// Возвращаем объект с методами
						return {
							// Установка рекорда
							setLeaderboardScore: async (lbName, score) => {
								console.log(
									"[TestYSDK] setLeaderboardScore() заглушка, name=",
									lbName,
									"score=",
									score
								);
								// Можно хранить в каком-то локальном объекте, если хотите
							},
							// Получить рекорд игрока
							getLeaderboardPlayerEntry: async (lbName) => {
								console.log(
									"[TestYSDK] getLeaderboardPlayerEntry() заглушка, name=",
									lbName
								);
								// Вернем тестовый объект
								return {
									score: 999,
									rank: 3,
									player: {
										publicName: "Stub player",
									},
								};
							},
							// Получить список записей
							getLeaderboardEntries: async (
								lbName,
								{ quantityTop, includeUser, quantityAround }
							) => {
								console.log(
									"[TestYSDK] getLeaderboardEntries() заглушка, lbName=",
									lbName
								);
								console.log(
									"  quantityTop=",
									quantityTop,
									" includeUser=",
									includeUser,
									" quantityAround=",
									quantityAround
								);

								// Пример возврата
								return {
									entries: [
										{
											rank: 1,
											score: 1500,
											player: { publicName: "Top1" },
										},
										{
											rank: 2,
											score: 1100,
											player: { publicName: "Top2" },
										},
										{
											rank: 3,
											score: 999,
											player: { publicName: "You" },
										},
									],
								};
							},
						};
					},

					// Платежи
					__paymentsInited: false,
					getPayments: async (options) => {
						console.log(
							"[TestYSDK] getPayments() заглушка, signed=",
							options?.signed
						);
						this.__paymentsInited = true;
						return {
							purchase: async ({ id, developerPayload }) => {
								console.log(
									"[TestYSDK] purchase() заглушка, id=",
									id,
									"payload=",
									developerPayload
								);
								if (!id) throw "No product id provided";
								// Считаем, что покупка успешна
								return {
									productID: id,
									purchaseToken: "stub-token-" + Date.now(),
									developerPayload: developerPayload || "",
									signature: "stub-signature",
								};
							},
							consumePurchase: async (token) => {
								console.log(
									"[TestYSDK] consumePurchase() заглушка, token=",
									token
								);
							},
							getPurchases: async () => {
								console.log("[TestYSDK] getPurchases() заглушка");
								// Вернём пустой массив
								return [];
							},
							getCatalog: async () => {
								console.log("[TestYSDK] getCatalog() заглушка");
								// Пример каталога
								return [
									{
										id: "gold500",
										title: "500 gold coins",
										description: "Gold coin pack",
										price: "15 YAN",
										priceValue: "15",
										priceCurrencyCode: "YAN",
										getPriceCurrencyImage: (size = "small") =>
											"https://yastatic.net/s3/games-static/static-data/images/payments/sdk/currency-icon-" +
											size +
											"@2x.png",
									},
									{
										id: "disable_ads",
										title: "Remove ads",
										description: "Disable all ads",
										price: "40 YAN",
										priceValue: "40",
										priceCurrencyCode: "YAN",
										getPriceCurrencyImage: (size = "small") =>
											"https://yastatic.net/s3/games-static/static-data/images/payments/sdk/currency-icon-" +
											size +
											"@2x.png",
									},
								];
							},
						};
					},

					// Отзывы (review)
					feedback: {
						canReview: async () => {
							console.log("[TestYSDK] feedback.canReview() заглушка");
							// Допустим, всегда true
							return { value: true, reason: "" };
						},
						requestReview: async () => {
							console.log("[TestYSDK] feedback.requestReview() заглушка");
							// feedbackSent = false, т.е. пользователь мог закрыть окно
							return { feedbackSent: false };
						},
					},
				});
			});
		},
	};

	// Экспортируем в window
	window.YaGames = YaGames;
}
