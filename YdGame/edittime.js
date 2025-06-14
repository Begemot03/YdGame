function GetPluginSettings() {
	return {
		name: "YdGame",
		id: "YdGame",
		version: "1.0",
		description: "Плагин для работы с Yandex Games SDK",
		author: "Петров Андрей",
		"help url": "https://yandex.ru/dev/games/doc/ru/sdk/sdk-about",
		category: "Platform specific",
		type: "object",
		flags: 0,
	};
}

///////////////////////////////////////////////////////
// Conditions

// Общие условия (Any adv)
AddCondition(
	9,
	cf_trigger,
	"On adv opened",
	"Adv",
	"On adv opened",
	"Triggered when any adv (fullscreen or rewarded) is opened.",
	"OnAdvOpened"
);
AddCondition(
	10,
	cf_trigger,
	"On adv closed",
	"Adv",
	"On adv closed",
	"Triggered when any adv (fullscreen or rewarded) is closed.",
	"OnAdvClosed"
);

// Fullscreen adv
AddCondition(
	1,
	0, // cf_none
	"Can show fullscreen adv",
	"Fullscreen Adv",
	"Can show adv",
	"Check if fullscreen adv can be shown.",
	"CanShowFullscreenAdv"
);
AddCondition(
	2,
	cf_trigger,
	"On fullscreen adv opened",
	"Fullscreen Adv",
	"On fullscreen adv opened",
	"Triggered when the fullscreen adv is opened.",
	"OnFullscreenAdvOpened"
);
AddCondition(
	3,
	cf_trigger,
	"On fullscreen adv closed",
	"Fullscreen Adv",
	"On fullscreen adv closed",
	"Triggered when the fullscreen adv is closed.",
	"OnFullscreenAdvClosed"
);
AddCondition(
	4,
	cf_trigger,
	"On fullscreen adv error",
	"Fullscreen Adv",
	"On fullscreen adv error",
	"Triggered when an error occurs while showing the fullscreen adv.",
	"OnFullscreenAdvError"
);

// Reward adv
AddCondition(
	5,
	cf_trigger,
	"On reward adv open",
	"Reward Adv",
	"On reward adv opened",
	"Triggered when the reward adv is opened.",
	"OnRewardAdvOpened"
);
AddCondition(
	6,
	cf_trigger,
	"On reward adv closed",
	"Reward Adv",
	"On reward adv closed",
	"Triggered when the reward adv is closed.",
	"OnRewardAdvClosed"
);
AddCondition(
	7,
	cf_trigger,
	"On reward adv error",
	"Reward Adv",
	"On reward adv error",
	"Triggered when an error occurs while showing the reward adv.",
	"OnRewardAdvError"
);
AddCondition(
	8,
	cf_trigger,
	"On rewarded",
	"Reward Adv",
	"On Rewarded",
	"Triggered when the user successfully finishes watching the reward adv.",
	"OnRewarded"
);

// Leaderboard
AddCondition(
	12,
	cf_trigger,
	"On player record updated",
	"Leaderboard",
	"On player record updated",
	"Triggered when the player's record data is updated (GetPlayerRecordInLeanderboard).",
	"OnPlayerRecordUpdated"
);
AddCondition(
	13,
	cf_trigger,
	"On leaderboard error",
	"Leaderboard",
	"On leaderboard error",
	"Triggered when the player record data update fails or is not present.",
	"OnLeaderboardError"
);
AddCondition(
	14,
	cf_trigger,
	"On leaderboard entries getted",
	"Leaderboard",
	"On leaderboard entries getted",
	"Triggered when the leaderboard entries loaded.",
	"OnLeaderboardEntriesGetted"
);

AddCondition(
	77,
	cf_trigger,
	"On leaderboard player record getted",
	"Leaderboard",
	"On leaderboard player record getted",
	"Triggered when the player record getted.",
	"OnPlayerRecordGetted"
);

// Player Data
AddCondition(
	15,
	cf_trigger,
	"On player auth",
	"Player Data",
	"On player auth",
	"Triggered when user is allowed to receive the data.",
	"OnPlayerAuth"
);

// Environment Data
AddCondition(
	16,
	0,
	"Has environment data",
	"Environment",
	"Has environment data",
	"Triggered when environment data loaded.",
	"HasEnvironmentData"
);

AddCondition(
	17,
	0,
	"Has url playload",
	"Environment",
	"Has url playload",
	"Triggered when url playload is available.",
	"HasPayload "
);

// Cloud Data
AddCondition(
	100,
	cf_trigger,
	"On data updated success",
	"Cloud Data",
	"On data updated success",
	"Triggered when cached data is successfully sent to server (player.setData).",
	"OnCloudDataUpdatedSuccess"
);

AddCondition(
	110,
	cf_trigger,
	"On stats updated success",
	"Cloud Data",
	"On stats updated success",
	"Triggered when cached stats are successfully sent to server (player.setStats).",
	"OnCloudStatsUpdatedSuccess"
);

AddCondition(
	111,
	cf_trigger,
	"On cloud error",
	"Cloud Data",
	"On cloud error",
	"Triggered when some cloud fails.",
	"OnCloudError"
);

AddCondition(
	112,
	cf_trigger,
	"On stats getted",
	"Cloud Data",
	"On stats getted",
	"Triggered when stats getted.",
	"OnCloudStatsGetted"
);

AddCondition(
	113,
	cf_trigger,
	"On data getted",
	"Cloud Data",
	"On data getted",
	"Triggered when data getted.",
	"OnCloudDataGetted"
);

// Purchases
AddCondition(
	200,
	cf_trigger,
	"On purchase success",
	"Purchase",
	"On purchase success",
	"Triggered when the purchase(...) promise resolves successfully.",
	"OnPurchaseSuccess"
);

AddCondition(
	201,
	cf_trigger,
	"On purchase error",
	"Purchase",
	"On purchase error",
	"Triggered when the purchase(...) promise fails (user closed, no product, etc.).",
	"OnPurchaseError"
);

AddCondition(
	202,
	cf_trigger,
	"On get purchases success",
	"Purchase",
	"On get purchases success",
	"Triggered when getPurchases() successfully returns the list of purchases.",
	"OnGetPurchasesSuccess"
);

AddCondition(
	203,
	cf_trigger,
	"On get catalog success",
	"Purchase",
	"On get catalog success",
	"Triggered when getCatalog() successfully returns the list of products.",
	"OnGetCatalogSuccess"
);

AddCondition(
	204,
	cf_trigger,
	"On purchses init success",
	"Purchase",
	"On purchses init success",
	"Triggered when getPayments() successfully.",
	"OnPurchasesInit"
);

// Review
AddCondition(
	500,
	cf_trigger,
	"On can review yes",
	"Review",
	"On can review yes",
	"Triggered when ysdk.feedback.canReview() returns value=true, i.e. user can rate the game.",
	"OnCanReviewYes"
);

AddCondition(
	501,
	cf_trigger,
	"On can review no",
	"Review",
	"On can review no",
	"Triggered when ysdk.feedback.canReview() returns value=false, i.e. user cannot rate the game. See LastReviewReason for details.",
	"OnCanReviewNo"
);

AddCondition(
	502,
	cf_trigger,
	"On request review complete",
	"Review",
	"On request review complete",
	"Triggered after ysdk.feedback.requestReview() promise resolves (feedbackSent=true or false).",
	"OnRequestReviewComplete"
);

///////////////////////////////////////////////////////
// Actions

// Fullscreen
AddAction(
	0,
	af_none,
	"Show fullscreen adv",
	"Fullscreen Adv",
	"Show fullscreen adv",
	"Show a fullscreen advertisement.",
	"ShowFullScreenAdv"
);

// Reward adv
AddStringParam("Reward Id", "Reward identificator", "");
AddAction(
	1,
	af_none,
	"Show reward adv",
	"Reward Adv",
	"Show reward adv with ID <i>{0}</i>",
	"Show a rewarded advertisement with the given Reward ID.",
	"ShowRewardAdv"
);

// Leaderboard
AddStringParam("Leaderboard Name", "Name of the leaderboard to update", "");
AddNumberParam("New Value", "The new score or value to set", 0);
AddAction(
	2,
	af_none,
	"Update Leaderboard Record",
	"Leaderboard",
	"Update leaderboard <i>{0}</i> with value <i>{1}</i>",
	"Update (or set) the player's value in the specified leaderboard.",
	"UpdateLeaderboardRecord"
);

AddStringParam("Leaderboard Name", "Name of the leaderboard to query", "");
AddAction(
	4,
	af_none,
	"Get Player Record in leaderboard",
	"Leaderboard",
	"Get player record in leaderboard <i>{0}</i> ",
	"Get the player's record in a specific leaderboard. Triggers OnPlayerRecordUpdated or OnLeaderboardError.",
	"GetPlayerRecordInLeanderboard"
);

AddStringParam("Leaderboard Name", "Name of the leaderboard", "");
AddNumberParam("Quantity Top", "Quantity of top entries", 0);
AddAction(
	5,
	af_none,
	"Get Leaderboard Entries",
	"Leaderboard",
	"Get leaderboard entries for <i>{0}</i> top <i>{1}</i>",
	"Get a range of leaderboard entries from YandexGames. Uses an internal timer to limit requests.",
	"GetLeaderboardEntries"
);

AddStringParam("Leaderboard Name", "Name of the leaderboard", "");
AddNumberParam("Quantity Top", "Quantity of top entries", 0);
AddNumberParam("Quantity Around", "Quantity around user", 0);
AddAction(
	6,
	af_none,
	"Get Leaderboard Entries With Player Data",
	"Leaderboard",
	"Get leaderboard entries for <i>{0}</i> top <i>{1}</i>, player around <i>{2}</i>",
	"Get a range of leaderboard entries from YandexGames. Uses an internal timer to limit requests.",
	"GetLeaderboardEntriesWithPlayer"
);

// Player Data
AddAction(
	7,
	af_none,
	"Auth player",
	"Player Data",
	"Asks the user to get the profile data",
	"Asks the user to get the profile data.",
	"AuthPlayer"
);

// Cloud Data
AddStringParam("Key", "Data key", "");
AddStringParam("Value", "Data value", "");
AddAction(
	200,
	af_none,
	"Set data",
	"Cloud Data",
	"Set data {0} = {1}",
	"Set data in local cache. Will be sent to server later. (every 3 seconds)",
	"SetCloudData"
);

AddStringParam(
	"Key",
	"Data key to retrieve from server. If empty, get all data",
	""
);
AddAction(
	201,
	af_none,
	"Get data",
	"Cloud Data",
	"Get data by key {0} from server",
	"Load data from server and update cache. If key is empty, load all keys.",
	"GetCloudData"
);

AddStringParam("Key", "Stats key", "");
AddNumberParam("Value", "Numeric value", 0);
AddAction(
	210,
	af_none,
	"Set stats",
	"Cloud Data",
	"Set stats {0} = {1}",
	"Set numeric stats in local cache. Will be sent later. (every 3 seconds)",
	"SetCloudStats"
);

AddStringParam("Key", "Stats key to retrieve. Empty => get all stats", "");
AddAction(
	211,
	af_none,
	"Get stats",
	"Cloud Data",
	"Get stats by key {0} from server",
	"Load stats from server and update local cache.",
	"GetCloudStats"
);

// Purchases
AddComboParamOption("false");
AddComboParamOption("true");
AddComboParam("Signed", "Use signed: true/false", 0);
AddAction(
	300,
	af_none,
	"Init purchases",
	"Purchase",
	"Init purchases with signed={0}",
	"Call ysdk.getPayments(...) to initialize payments object.",
	"InitPurchases"
);

AddStringParam(
	"Product ID",
	"ID of the product (defined in developer console)",
	""
);
AddStringParam("Developer Payload", "Optional developer payload", "");
AddAction(
	301,
	af_none,
	"Purchase",
	"Purchase",
	"Purchase <i>{0}</i> with payload <i>{1}</i>",
	"Call payments.purchase() for the specified product ID.",
	"Purchase"
);

AddAction(
	302,
	af_none,
	"Get purchases",
	"Purchase",
	"Get purchases from server",
	"Call payments.getPurchases() and cache them. Trigger OnGetPurchasesSuccess on success.",
	"GetPurchases"
);

AddStringParam(
	"Purchase Token",
	"Token to consume (from last purchase or from cached list).",
	""
);
AddAction(
	303,
	af_none,
	"Consume purchase",
	"Purchase",
	"Consume purchase token <i>{0}</i>",
	"Use payments.consumePurchase(token).",
	"ConsumePurchase"
);

AddAction(
	304,
	af_none,
	"Get catalog",
	"Purchase",
	"Get catalog from server",
	"Call payments.getCatalog() and cache products. Trigger OnGetCatalogSuccess on success.",
	"GetCatalog"
);

// Review
AddAction(
	600,
	af_none,
	"Check can review",
	"Review",
	"Check can review",
	"Call ysdk.feedback.canReview() to see if user can rate the game. Triggers OnCanReviewYes or OnCanReviewNo.",
	"CheckCanReview"
);

AddAction(
	601,
	af_none,
	"Request review",
	"Review",
	"Request review",
	"Call ysdk.feedback.requestReview() to open rating popup. Triggers OnRequestReviewComplete afterwards.",
	"RequestReview"
);

///////////////////////////////////////////////////////
// Expressions

// Fullscreen adv
AddExpression(
	0,
	ef_return_number,
	"Is last fullscreen adv showed",
	"Fullscreen Adv",
	"IsLastFullscreenAdvShowed",
	"Return 1 if the last fullscreen adv was shown, else 0."
);
AddExpression(
	1,
	ef_return_string,
	"Get last fullscreen adv error",
	"Fullscreen Adv",
	"LastFullscreenAdvError",
	"Return the last error message from fullscreen adv."
);

// Reward adv
AddExpression(
	2,
	ef_return_string,
	"Get last reward id",
	"Reward Adv",
	"LastRewardId",
	"Return the last reward ID that was used in ShowRewardAdv."
);

AddExpression(
	3,
	ef_return_string,
	"Get last reward error",
	"Reward Adv",
	"LastRewardError",
	"Return the last reward error."
);

// Leaderboard
AddStringParam("Leaderboard Name", "Leaderboard Name", "");
AddExpression(
	4,
	ef_return_number,
	"Get player leaderboard record",
	"Leaderboard",
	"LeaderboardPlayerRecord",
	"Get the player's leaderboard record (score) for the given leaderboard name."
);

AddStringParam("Leaderboard Name", "Leaderboard Name", "");
AddExpression(
	5,
	ef_return_number,
	"Has leaderboard entries data",
	"Leaderboard",
	"HasLeaderboardEntries",
	"Has entries data for the given leaderboard name."
);

AddStringParam("Leaderboard Name", "Leaderboard Name", "");
AddExpression(
	6,
	ef_return_number,
	"Get leaderboard entries length",
	"Leaderboard",
	"GetLeaderboardEntriesLength",
	"Get entries length for the given leaderboard name."
);

AddStringParam("Leaderboard Name", "Leaderboard Name", "");
AddNumberParam("Entries Id", "Entries Id", 0);
AddExpression(
	7,
	ef_return_number,
	"Get player name by id in leaderboard entries",
	"Leaderboard",
	"GetPlayerNameInLeaderboardEntries",
	"Get player name by id in leaderboard entries for the given leaderboard name."
);

AddStringParam("Leaderboard Name", "Leaderboard Name", "");
AddNumberParam("Entries Id", "Entries Id", 0);
AddExpression(
	8,
	ef_return_number,
	"Get player score by id in leaderboard entries",
	"Leaderboard",
	"GetPlayerScoreInLeaderboardEntries",
	"Get player score by id in leaderboard entries for the given leaderboard name."
);

// Flags
AddStringParam("Flag", "Flag name", "");
AddExpression(
	3,
	ef_return_string,
	"Get flag value by name",
	"Flag",
	"FlagValue",
	"Return the value of a named flag from YandexGames. Empty if not found."
);

// Player Data
AddExpression(
	9,
	ef_return_string,
	"Get player name",
	"Player Data",
	"PlayerName",
	"Get player name. Only is player auth."
);

AddExpression(
	10,
	ef_return_string,
	"Get player paying status",
	"Player Data",
	"PlayerPayingStatus",
	"Get player paying status. Only is player auth."
);

AddExpression(
	11,
	ef_return_number,
	"Get player auth state",
	"Player Data",
	"PlayerIsAuth",
	"Get player auth state."
);

AddExpression(
	12,
	ef_return_string,
	"Get player id",
	"Player Data",
	"PlayerId",
	"Get player id (string)."
);

// Environment Data
AddExpression(
	13,
	ef_return_number,
	"Get evnironment data load status",
	"Environment",
	"IsEnvironmentLoaded",
	"Get evnironment data load status (0 || 1)."
);

AddExpression(
	14,
	ef_return_number,
	"Player device type is mobile",
	"Environment",
	"IsMobile",
	"Player device type is mobile (0 || 1)."
);

AddExpression(
	15,
	ef_return_number,
	"Player device type is tablet",
	"Environment",
	"IsTablet",
	"Player device type is tablet (0 || 1)."
);

AddExpression(
	16,
	ef_return_number,
	"Player device type is desktop",
	"Environment",
	"IsDesktop",
	"Player device type is desktop (0 || 1)."
);

AddExpression(
	17,
	ef_return_number,
	"Player device type is tv",
	"Environment",
	"IsTV",
	"Player device type is tv (0 || 1)."
);

AddExpression(
	18,
	ef_return_string,
	"Get app id",
	"Environment",
	"AppId",
	"Get app id (string). If app id undefined, then return empty string."
);

AddExpression(
	19,
	ef_return_string,
	"Get player lang",
	"Environment",
	"Lang",
	"Get player lang (string). If lang undefined, then return empty string."
);

AddExpression(
	20,
	ef_return_string,
	"Get url payload",
	"Environment",
	"Payload",
	"Get url payload (string). If payload undefined, then return empty string."
);

// Cloud Data
AddStringParam("Key", "Data key");
AddExpression(
	300,
	ef_return_string,
	"Get cached data value",
	"Cloud Data",
	"CloudDataValue",
	"Returns the local cached value for a given data key."
);

AddStringParam("Key", "Stats key");
AddExpression(
	301,
	ef_return_number,
	"Get cached stats value",
	"Cloud Data",
	"CloudStatsValue",
	"Returns the local cached numeric value for a given stats key."
);

AddExpression(
	302,
	ef_return_string,
	"Last error",
	"Cloud Data",
	"LastCloudError",
	"Returns the last error message from data/stats updates."
);

AddStringParam("Key", "Data key");
AddExpression(
	350,
	ef_return_number,
	"Cloud Data Exists",
	"Cloud Data",
	"CloudDataExists",
	"Returns 1 if the specified key exists in the cloud data cache, 0 otherwise."
);

AddStringParam("Key", "Stats key");
AddExpression(
	351,
	ef_return_number,
	"Cloud Stats Exists",
	"Cloud Data",
	"CloudStatsExists",
	"Returns 1 if the specified key exists in the cloud stats cache, 0 otherwise."
);

// Purchases
AddExpression(
	400,
	ef_return_string,
	"Last purchase error",
	"Purchase",
	"LastPurchaseError",
	"Return the last error message related to purchase or payment methods."
);

AddExpression(
	401,
	ef_return_number,
	"Purchases count",
	"Purchase",
	"PurchasesCount",
	"Return the number of cached purchases from getPurchases."
);

AddNumberParam("Index", "Index of purchase (0-based).", 0);
AddExpression(
	402,
	ef_return_string,
	"Get productId of purchase",
	"Purchase",
	"PurchaseProductId",
	"Return the productID of a purchase in the cached list."
);

AddNumberParam("Index", "Index of purchase (0-based).", 0);
AddExpression(
	403,
	ef_return_string,
	"Get purchase token",
	"Purchase",
	"PurchaseToken",
	"Return the purchaseToken of a purchase in the cached list."
);

AddExpression(
	404,
	ef_return_number,
	"Catalog count",
	"Purchase",
	"CatalogCount",
	"Return how many products are in the cached catalog from getCatalog."
);

AddNumberParam("Index", "Index of product (0-based).", 0);
AddExpression(
	405,
	ef_return_string,
	"Get product ID from catalog",
	"Purchase",
	"CatalogProductId",
	"Return the 'id' field of a product in the cached catalog."
);

AddNumberParam("Index", "Index of product (0-based).", 0);
AddExpression(
	406,
	ef_return_string,
	"Get product price",
	"Purchase",
	"CatalogProductPrice",
	"Return the price field (e.g. '100 YAN')."
);

AddNumberParam("Index", "Index of product (0-based).", 0);
AddExpression(
	407,
	ef_return_string,
	"Get product title",
	"Purchase",
	"CatalogProductTitle",
	"Return the title of product in the catalog."
);

AddNumberParam("Index", "Index of product (0-based).", 0);
AddExpression(
	411,
	ef_return_string,
	"Get product description",
	"Purchase",
	"CatalogProductDescription",
	"Return the description of product in the catalog."
);

AddNumberParam("Index", "Index of product in cached catalog (0-based).", 0);
AddStringParam(
	"Size",
	"Icon size: small, medium, svg. Default is 'small'.",
	'"small"'
);
AddExpression(
	408,
	ef_return_string,
	"Get currency icon URL for the product",
	"Purchase",
	"CatalogProductCurrencyImage",
	"Returns the URL of the currency icon for a product's price currency, e.g. small/medium/svg."
);

AddExpression(
	409,
	ef_return_string,
	"Last purchase product id",
	"Purchase",
	"LastPurchaseProductId",
	"Returns last purchase product id."
);

AddExpression(
	410,
	ef_return_string,
	"Last purchase token",
	"Purchase",
	"LastPurchaseToken",
	"Returns last purchase token."
);

// Review
// Возвращает причину, почему canReview = false (NO_AUTH, GAME_RATED, ...)
AddExpression(
	700,
	ef_return_string,
	"Get last review reason",
	"Review",
	"LastReviewReason",
	"Returns the last reason why user cannot review (e.g. 'NO_AUTH', 'GAME_RATED'). Empty if none."
);

// Возвращает 'ошибку' - например, если произошёл reject
AddExpression(
	701,
	ef_return_string,
	"Get last review error",
	"Review",
	"LastReviewError",
	"Returns the last error string if an unexpected error occurred."
);

// feedbackSent: 0 или 1
AddExpression(
	702,
	ef_return_number,
	"Get last feedback sent",
	"Review",
	"LastFeedbackSent",
	"Returns 1 if user actually sent feedback, 0 if user closed the window or not available."
);

AddExpression(
	703,
	ef_return_string,
	"Get last init sdk error",
	"Initialization",
	"LastSDKInitError",
	"Get last init sdk error message."
);

AddExpression(
	704,
	ef_return_number,
	"Get 1 if sdk init success, else 0",
	"Initialization",
	"IsSDKInitialized",
	"Get 1 if sdk init success, else 0."
);

AddCondition(
	1000,
	cf_trigger,
	"On SDK initialized",
	"Initialization",
	"On SDK initialized",
	"Triggered when the Yandex Games SDK is successfully initialized.",
	"OnSDKInitialized"
);

AddCondition(
	1001,
	cf_trigger,
	"On SDK initialization failed",
	"Initialization",
	"On SDK initialization failed",
	"Triggered when Yandex Games SDK initialization fails.",
	"OnSDKInitFailed"
);

AddExpression(
	1000,
	ef_return_number,
	"Is SDK initialized",
	"Initialization",
	"IsSDKInitialized",
	"Returns 1 if the SDK is initialized, otherwise 0."
);

///////////////////////////////////////////////////////
ACESDone();

// Параметры объекта (Properties) для редактора Construct
var property_list = [];

function CreateIDEObjectType() {
	return new IDEObjectType();
}

function IDEObjectType() {}

IDEObjectType.prototype.CreateInstance = function (instance) {
	return new IDEInstance(instance);
};

function IDEInstance(instance) {
	this.instance = instance;
	this.properties = {};
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
}

IDEInstance.prototype.OnInserted = function () {};
IDEInstance.prototype.OnDoubleClicked = function () {};
IDEInstance.prototype.OnPropertyChanged = function (property_name) {};
IDEInstance.prototype.Draw = function (renderer) {};
IDEInstance.prototype.OnRendererReleased = function () {};
