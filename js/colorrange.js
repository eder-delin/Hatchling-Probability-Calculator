class colorRange {
  constructor (c1, c2, isParent, isSingleColor){
    this.isParent = isParent;
    this.disregard = false;
    this.crossesZero = false;
    var diff1 = Math.abs(c1-c2);
    var diff2 = Math.abs(177-diff1);
    // window.alert(diff1+" "+diff2);
    if (isParent && (c1 == 0 || c2 == 0)){
      //check if parent range is empty = not a factor
      this.disregard = true;
      this.length = 0;
    }
    else if (!isParent && c1 == 0){
      //hatchling range empty = not a factor
      this.disregard = true;
      this.length = 0;
    }
    else if (!isParent && isSingleColor){
      //hatchling ranges are either single color or a range.
      this.lowerEnd = c1;
      this.upperEnd = this.lowerEnd;
      this.length = 1;
    }
    //set lower + upper range ends for later comparing, set range length
    //only applies if not single color range. doesnt work in that case
    if (!isSingleColor){
      if (diff1 < diff2){
        this.lowerEnd = Math.min(c1,c2);
        this.upperEnd = Math.max(c1,c2);
        this.length = diff1 + 1;
      }
      else if (diff1 > diff2){
        this.lowerEnd = Math.max(c1,c2);
        this.upperEnd = Math.min(c1,c2);
        this.length = diff2 + 1;
      }
    }
    //check if range goes across the 177->1 jump
    if (this.lowerEnd > this.upperEnd) this.crossesZero = true;
  }
}

class rangeRelation {
  //pass ranges for checking and overlap calculation
  constructor (p1, h1, p2, h2, p3, h3, option){
    if (p1.disregard || h1.disregard) this.dis1 = true;
    else this.dis1 = false;
    if (p2.disregard || h2.disregard) this.dis2 = true;
    else this.dis2 = false;
    if (p3.disregard || h3.disregard) this.dis3 = true;
    else this.dis3 = false;
    if (!this.dis1 && !rangeRelation.isValid(p1, h1, option)) {
      window.alert("Invalid primary range");
      this.error = true;
    }
    if (!this.dis2 && !rangeRelation.isValid(p2, h2, option)) {
      window.alert("Invalid secondary range");
      this.error = true;
    }
    if (!this.dis3 && !rangeRelation.isValid(p3, h3, option)) {
      window.alert("Invalid tertiary range");
      this.error = true;
    }
    if (!this.error){
      if (!this.dis1) this.overlap1 = rangeRelation.calcOverlap(p1, h1);
      if (!this.dis2) this.overlap2 = rangeRelation.calcOverlap(p2, h2);
      if (!this.dis3) this.overlap3 = rangeRelation.calcOverlap(p3, h3);
    }
  }
  //check if range relation is valid. r1 parent range, r2 target range
  static isValid(r1, r2, option) {
    var bounds = rangeRelation.normalize(r1,r2);
    //compare
    if (!option){
      if(bounds[0] <= bounds[1] && bounds[3] <= bounds[2]) return true;
      else return false;
    }
    else {
      if((bounds[0] <= bounds[1] && bounds[1] <= bounds[2]) //target overlaps on right side OR fully included
      || (bounds[3] <= bounds[2] && bounds[0] <= bounds[3]) //target overlaps on left side
      || (bounds[1] <= bounds[0] && bounds[2] <= bounds[3])) return true; // full overlap, target range longer
      else return false;
    }
  }
  //normalize ranges for comparisons
  static normalize (r1, r2) {
    var lower1 = parseInt(r1.lowerEnd, 10);
    var lower2 = parseInt(r2.lowerEnd, 10);
    var upper1 = parseInt(r1.upperEnd, 10);
    var upper2 = parseInt(r2.upperEnd, 10);
    var lowbound;
    //normalize ranges for easier comparing
    if (r1.crossesZero == r2.crossesZero) lowbound = Math.min(lower1, lower2);
    else {
      //color 88 (mantis) is where range to maize flips.
      if (lower1 > 88 && lower2 > 88){
        lowbound = Math.min(lower1, lower2);
      }
      else lowbound = Math.max(lower1, lower2);
    }
    if (lower1 < lowbound) lower1+=177;
    if (lower2 < lowbound) lower2+=177;
    if (upper1 < lowbound) upper1+=177;
    if (upper2 < lowbound) upper2+=177;
    return [lower1, lower2, upper1, upper2];
  }
  //calculate range overlaps
  static calcOverlap (r1, r2) {
    var bounds = rangeRelation.normalize(r1, r2);
    return Math.min(bounds[2], bounds[3]) - Math.max(bounds[0], bounds[1]) + 1;
  }
}
