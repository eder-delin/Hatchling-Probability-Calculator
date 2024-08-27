//save calculated probabilities
//breed, 3x genes, 3x colors, pose (0.5).
var probs = Array(8).fill(1);

// strategie gene/breed: 1) teste auf none -> prob=1
// 2) a=b -> a=b=target: prob=1. target diff gene: prob=0.
// 3) sonst target=a -> vergleiche a, target, target=b -> vergleiche b, target.
// 4) ansonsten prob=0.
function calcProb(){
  //check for error
  if (rangeRel.error) {
    probs = Array(8).fill(0);
    return;
  }
  //breed prob. if target id = none, its set to "any". -> prob = 1
  if (targetBreed[0] != 'none' && parentBreedA[0] != 'none' && parentBreedB[0] != 'none'){
    if (parentBreedA[0] == parentBreedB[0]){
      if (targetBreed[0] == parentBreedA[0]){
        probs[0] = 1;
      }
      else probs[0] = 0;
    }
    else if (targetBreed[0] == parentBreedA[0]){
      probs[0] = compareRarity(parentBreedA[1],parentBreedB[1]);
    }
    else if (targetBreed[0] == parentBreedB[0]){
      probs[0] = compareRarity(parentBreedB[1],parentBreedA[1]);
    }
    else {
      probs[0] = 0;
    }
  }
  else probs[0] = 1;

  //pose prob
  if (targetPose != 0) probs[7] = 0.5;
  else probs[7] = 1;

  //gene probs. if any have id = 0 disregard it
  if (targetPrimary[0] != 'none' && parentPrimaryA[0] != 'none' && parentPrimaryB[0] != 'none'){
    if (parentPrimaryA[0] == parentPrimaryB[0]){
      if (targetPrimary[0] == parentPrimaryA[0]){
        probs[0] = 1;
      }
      else probs[0] = 0;
    }
    else if (targetPrimary[0] == parentPrimaryA[0]){
      probs[1] = compareRarity(parentPrimaryA[1],parentPrimaryB[1]);
    }
    else if (targetPrimary[0] == parentPrimaryB[0]){
      probs[1] = compareRarity(parentPrimaryB[1],parentPrimaryA[1]);
    }
    else {
      probs[1] = 0;
    }
  }
  //disregard case
  else probs[1] = 1;

  if (targetSecondary[0] != 'none' && parentSecondaryA[0] != 'none' && parentSecondaryB[0] != 'none'){
    if (parentSecondaryA[0] == parentSecondaryB[0]){
      if (targetSecondary[0] == parentSecondaryA[0]){
        probs[2] = 1;
      }
      else probs[2] = 0;
    }
    else if (targetSecondary[0] == parentSecondaryA[0]){
      probs[2] = compareRarity(parentSecondaryA[1],parentSecondaryB[1]);
    }
    else if (targetSecondary[0] == parentSecondaryB[0]){
      probs[2] = compareRarity(parentSecondaryB[1],parentSecondaryA[1]);
    }
    else {
      probs[2] = 0;
    }
  }
  else probs[2] = 1;

  if (targetTertiary[0] != 'none' && parentTertiaryA[0] != 'none' && parentTertiaryB[0] != 'none'){
    if (parentTertiaryA[0] == parentTertiaryB[0]){
      if (targetTertiary[0] == parentTertiaryA[0]){
        probs[3] = 1;
      }
      else probs[3] = 0;
    }
    else if (targetTertiary[0] == parentTertiaryA[0]){
      probs[3] = compareRarity(parentTertiaryA[1],parentTertiaryB[1]);
    }
    else if (targetTertiary[0] == parentTertiaryB[0]){
      probs[3] = compareRarity(parentTertiaryB[1],parentTertiaryA[1]);
    }
    else {
      probs[3] = 0;
    }
  }
  else probs[3] = 1;

  //color probs / array index 4-6
  //check for disregard
  if (parentPrimaryRange.disregard || targetPrimaryRange.disregard){
    probs[4] = 1;
  }
  //actual calculation.
  else {
    probs[4] = rangeRel.overlap1 / parentPrimaryRange.length;
  }
  //disregard?
  if (parentSecondaryRange.disregard || targetSecondaryRange.disregard){
    probs[5] = 1;
  }
  //calcs
  else {
    probs[5] = rangeRel.overlap2 / parentSecondaryRange.length;
  }
  //disregard?
  if (parentTertiaryRange.disregard || targetTertiaryRange.disregard){
    probs[6] = 1;
  }
  //calc
  else {
    probs[6] = rangeRel.overlap3 / parentTertiaryRange.length;
  }
}

function finalProb(){
  var result = 1;
  for (var i=0; i<probs.length; i++){
    result = result * probs[i];
  }
  return result;
}

function binomial(n,p){
  //prob to get at least 1 success = inverted prob of getting no result.
  //binomial coeff disappears bc n over 0 = 1.
  //simply inverse prob to power of n (no success in n tries)
  var result = Math.pow(1-p,n);
  return 1-result;
}

function showProbability(prefix, n){
  var p = finalProb();
  if (n==4) document.getElementById(prefix+"result5").innerHTML = "";
  for(var i=1;i<=n;i++){
    var elementName = prefix + "result" + i;
    var prob = Math.round((binomial(i,p) + Number.EPSILON) * 100000) / 1000;
    var resultString = i + " egg nest: "
    document.getElementById(elementName).innerHTML = resultString + prob + "%";
  }
}

function compareRarity(targetIndex, compareIndex){
  const raritySet = new Set();
  raritySet.add(parseInt(targetIndex,10));
  raritySet.add(parseInt(compareIndex,10));

  //target trait more common
  if (targetIndex < compareIndex){
    if (raritySet.has(0) && raritySet.has(1)){ //plentiful, common
      return 0.7;
    }
    if (raritySet.has(0) && raritySet.has(2)){ //plentiful, uncommon
      return 0.85;
    }
    if (raritySet.has(0) && raritySet.has(3)){ //plentiful, limited
      return 0.97;
    }
    if (raritySet.has(0) && raritySet.has(4)){ //plentiful, rare
      return 0.99;
    }
    if (raritySet.has(1) && raritySet.has(2)){ //common, uncommon
      return 0.75;
    }
    if (raritySet.has(1) && raritySet.has(3)){ //common, limited
      return 0.9;
    }
    if (raritySet.has(1) && raritySet.has(4)){ //common, rare
      return 0.99;
    }
    if (raritySet.has(2) && raritySet.has(3)){ //uncommon, limited
      return 0.85;
    }
    if (raritySet.has(2) && raritySet.has(4)){ //uncommon, rare
      return 0.98;
    }
    if (raritySet.has(3) && raritySet.has(4)){ //limited, rare
      return 0.97;
    }
  }
  //target trait less common
  if (targetIndex > compareIndex){
    if (raritySet.has(0) && raritySet.has(1)){ //plentiful, common
      return 0.3;
    }
    if (raritySet.has(0) && raritySet.has(2)){ //plentiful, uncommon
      return 0.15;
    }
    if (raritySet.has(0) && raritySet.has(3)){ //plentiful, limited
      return 0.03;
    }
    if (raritySet.has(0) && raritySet.has(4)){ //plentiful, rare
      return 0.01;
    }
    if (raritySet.has(1) && raritySet.has(2)){ //common, uncommon
      return 0.25;
    }
    if (raritySet.has(1) && raritySet.has(3)){ //common, limited
      return 0.1;
    }
    if (raritySet.has(1) && raritySet.has(4)){ //common, rare
      return 0.01;
    }
    if (raritySet.has(2) && raritySet.has(3)){ //uncommon, limited
      return 0.15;
    }
    if (raritySet.has(2) && raritySet.has(4)){ //uncommon, rare
      return 0.02;
    }
    if (raritySet.has(3) && raritySet.has(4)){ //limited, rare
      return 0.03;
    }
  }
  else{ //same rarity
    return 0.5;
  }
}
