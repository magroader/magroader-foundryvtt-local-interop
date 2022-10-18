
Hooks.on("updateCombat", function(combat) {
  if (!isActiveGM())
    return;
  if (combat == undefined)
    return;
  var combatant = combat.combatant;
  if (combatant == undefined)
    return;
  var actor = combatant.actor;
  if (actor == undefined)
    return;
  //console.log("magroader current combat actor: " + actor.name);
  post("updateCombat", {hook: "combatUpdate", "currentCombatantName": actor.name});
});

Hooks.on("deleteCombat", function(params) {
  //console.log("magroader combat ended");
  post("endCombat", {});
});

function isActiveGM(user) {
	return user.active && user.isGM;
}

function post(path, data) {
  //var url = "https://14f1b025-4626-454a-921c-b04882be24b0.mock.pstmn.io/"
  var url = "http://localhost:31832/"
  return fetch(url + path, {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
}