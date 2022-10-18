let moduleName = "magroader-foundryvtt-local-interop";

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
});

Hooks.on("updateCombat", function(combat) {
  if (!isResponsibleGM())
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
  post("endCombat", {});
});

function isResponsibleGM() {
	if (!game.user.isGM)
		return false;
	const connectedGMs = game.users.filter(isActiveGM);
	return !connectedGMs.some(other => other.id < game.user.id);
}

function isActiveGM(user) {
	return user.active && user.isGM;
}

function post(path, data) {
  var url = setting("fetch-url");
  return fetch(url + path, {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)})
    .catch((error) => console.warn("Failed to post \"" + url + path + "\" with error: " + error));
}

function setting(key) {
  return game.settings.get(moduleName, key);
}