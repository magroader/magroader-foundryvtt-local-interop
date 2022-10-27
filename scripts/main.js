let moduleName = "magroader-foundryvtt-local-interop";
let defaultUserChoices = {};
let unknownUserId = "unknownUser";

Hooks.once('init', function() {
  console.log("CALLING REGISTER SETTINGS");

	game.settings.register(moduleName, "fetch-url", {
		name: "Fetch Url",
		hint: "Where to send POST / GET requests to",
		scope: "world",
		config: true,
		default: "http://localhost:31832/",
		type: String,
	});

	game.settings.register(moduleName, "interop-user", {
		name: "Interop User",
		hint: "Which user to send POST / GET requests to",
		scope: "world",
    config: true,
    restricted: true,
    choices: defaultUserChoices,
    default: unknownUserId,
    type: String,
	});
});

Hooks.once('ready', function() {
  game.users.forEach((u) => {
    defaultUserChoices[u.id] = u.name;
  });
  game.settings.settings.get(moduleName + '.interop-user').choices = defaultUserChoices;
});

Hooks.on("updateCombat", function(combat) {
  if (!isInteropUser())
    return;
  if (combat == undefined)
    return;
  var combatant = combat.combatant;
  if (combatant == undefined)
    return;
  var actor = combatant.actor;
  if (actor == undefined)
    return;

  post("updateCombat", {hook: "combatUpdate", "currentCombatantName": actor.name});
});

Hooks.on("deleteCombat", function(params) {
  if (!isInteropUser())
    return;

  post("endCombat", {});
});

function isInteropUser() {
  return game?.user?.id === game.settings.get(moduleName, 'interop-user');
}

function post(path, data) {
  var url = setting("fetch-url");
  return fetch(url + path, {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)})
    .catch((error) => console.warn("Failed to post \"" + url + path + "\" with error: " + error));
}

function setting(key) {
  return game.settings.get(moduleName, key);
}