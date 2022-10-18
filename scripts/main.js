Hooks.on("updateCombat", function(combat) {
  if (combat == undefined)
    return;
  var combatant = combat.combatant;
  if (combatant == undefined)
    return;
  var actor = combatant.actor;
  if (actor == undefined)
    return;
  console.log("magroader current combat actor: " + actor.name);
});

Hooks.on("deleteCombat", function(params) {
  console.log("magroader combat ended");
});