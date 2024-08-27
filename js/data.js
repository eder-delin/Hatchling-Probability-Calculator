//parent data
var parentPrimaryRange, parentSecondaryRange, parentTertiaryRange;
var parentBreedA, parentBreedB;
var parentPrimaryA, parentPrimaryB, parentSecondaryA, parentSecondaryB, parentTertiaryA, parentTertiaryB;

//hatchling target data
var targetPrimaryRange, targetSecondaryRange, targetTertiaryRange;
var targetBreed, targetPose;
var targetPrimary, targetSecondary, targetTertiary;

var rangeOpt, rangeRel;

function readForm(type, singlePrimary, singleSecondary, singleTertiary){
  var prefix = type, isModern = false, expString = "?" + type;
  var pc1, pc2, sc2, sc2, tc1, tc2;
  if (type == "m_") isModern = true;

  //get parent colors
  pc1 = document.getElementById(prefix+"primarycolorA").value;
  pc2 = document.getElementById(prefix+"primarycolorB").value;
  sc1 = document.getElementById(prefix+"secondarycolorA").value;
  sc2 = document.getElementById(prefix+"secondarycolorB").value;
  tc1 = document.getElementById(prefix+"tertiarycolorA").value;
  tc2 = document.getElementById(prefix+"tertiarycolorB").value;
  parentPrimaryRange = new colorRange(pc1, pc2, true, false);
  parentSecondaryRange = new colorRange(sc1, sc2, true, false);
  parentTertiaryRange = new colorRange(tc1, tc2, true, false);
  //get parent breeds
  parentBreedA = document.getElementById(prefix+"breedA").value.split("_");
  parentBreedB = document.getElementById(prefix+"breedB").value.split("_");
  //get parent genes
  parentPrimaryA = document.getElementById(prefix+"priGeneA").value.split("_");
  parentPrimaryB = document.getElementById(prefix+"priGeneB").value.split("_");
  parentSecondaryA = document.getElementById(prefix+"secGeneA").value.split("_");
  parentSecondaryB = document.getElementById(prefix+"secGeneB").value.split("_");
  parentTertiaryA = document.getElementById(prefix+"tertGeneA").value.split("_");
  parentTertiaryB = document.getElementById(prefix+"tertGeneB").value.split("_");
  //export parent values
  expString = expString+"&"+parentBreedA[0]+"-"+pc1+"-"+parentPrimaryA[0]+"-"+sc1+"-"+parentSecondaryA[0]+"-"+tc1+"-"+parentTertiaryA[0];
  expString = expString+"&"+parentBreedB[0]+"-"+pc2+"-"+parentPrimaryB[0]+"-"+sc2+"-"+parentSecondaryB[0]+"-"+tc2+"-"+parentTertiaryB[0];

  //get hatchling colors
  pc1 = document.getElementById(prefix+"primarycolor").value;
  pc2 = document.getElementById(prefix+"primary_range").value;
  sc1 = document.getElementById(prefix+"secondarycolor").value;
  sc2 = document.getElementById(prefix+"secondary_range").value;
  tc1 = document.getElementById(prefix+"tertiarycolor").value;
  tc2 = document.getElementById(prefix+"tertiary_range").value;

  //if box is checked but no range is selected, switch to single color anyway.
  if (pc2 == 0) singlePrimary = true;
  if (sc2 == 0) singleSecondary = true;
  if (tc2 == 0) singleTertiary = true;
  targetPrimaryRange = new colorRange(pc1, pc2, false, singlePrimary);
  targetSecondaryRange = new colorRange(sc1, sc2, false, singleSecondary);
  targetTertiaryRange = new colorRange(tc1, tc2, false, singleTertiary);
  //get hatchling breed
  targetBreed = document.getElementById(prefix+"breed").value.split("_");
  //get hatchling pose
  targetPose = document.getElementById(prefix+"pose").value;
  //get hatchling genes
  targetPrimary = document.getElementById(prefix+"priGene").value.split("_");
  targetSecondary = document.getElementById(prefix+"secGene").value.split("_");
  targetTertiary = document.getElementById(prefix+"tertGene").value.split("_");

  //check range option, define range relations
  rangeOpt = document.getElementById(prefix+"rangeOption").checked;
  rangeRel = new rangeRelation(parentPrimaryRange, targetPrimaryRange, parentSecondaryRange,
    targetSecondaryRange, parentTertiaryRange, targetTertiaryRange, rangeOpt);

  //export hatching values
  expString = expString+"&"+targetBreed[0];
  expString = expString+"-"+pc1+"-"+targetPrimary[0];
  expString = expString+"-"+sc1+"-"+targetSecondary[0];
  expString = expString+"-"+tc1+"-"+targetTertiary[0];
  expString = expString+"-"+pc2+"-"+sc2+"-"+tc2+"-"+targetPose;
  //export range + option toggles
  expString = expString + "-" + (singlePrimary ? "0" : "1");
  expString = expString + "-" + (singleSecondary ? "0" : "1");
  expString = expString + "-" + (singleTertiary ? "0" : "1");
  expString = expString + "&" + (rangeOpt ? "0" : "1");
  calcProb();
  //reduced nest: modern breed, parent breeds have same id =/= none.
  //ancient breeds can not interbreed, but have 5 eggs anyway.
  if (isModern && parentBreedA[0] != 'none' && parentBreedA[0] == parentBreedB[0]){
    showProbability(type, 4);
  }
  else showProbability(type, 5);
  document.getElementById(type+"export").innerHTML = "https://hatchling-probability.ew.r.appspot.com/"+expString;
}
