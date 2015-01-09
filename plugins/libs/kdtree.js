// @author Efe Karakus
function KDTree() {
    this._points = Array.prototype.slice.call(arguments, 0)[0];
    this._k = Array.prototype.slice.call(arguments, 1)[0];
    this._pointIndex = [];


    // Builds a kdtree with the given points, mainly assigns the correct indices to the array pointIndex
    // such that the median of each subarray represents the root of a subtree.
    this.init = function () {
        var l = this._points.length;
        for (var i = 0; i < l; i += 1) {
            this._pointIndex.push(i);
        }
        this._buildTree(0, l - 1, 0);
//        for (var i = 0; i < l; i += 1) {
//            console.log(this._pointIndex[i]);
//            console.table(this._points[this._pointIndex[i]]);
//        }
    }

    // Searches the kdtree in two steps:
    //
    //	1-	Recursively traverses the tree to find the hyperrectangle that could be dimensionally closer to
    //		the target point, this is done with a regular BST search functionality.
    //
    //	2-	Backup to check if parent is closer to target point, if so we gotta search for the points that are
    //		now within radius of the parent point.
    //
    // @param target Point that we want to find nearest neighbor to.
    // @return Point in this._points that is closest to target.
    this.findNearestNeighbor = function (target) {
        if (this._points.length === 0) {
            return null;
        }

        var start = 0, end = this._points.length - 1, d = 0,
            median = Math.floor((start + end) / 2),
            medianIndex = this._pointIndex[median],
            best = this._points[medianIndex];
        return this._nn(target, best, start, end, d);
    }

    // Builds the tree recursively by sorting each subarray and partitioning it into two again.
    // @param start Number representing the start index for pointIndex.
    // @param end Number representing the end index for pointIndex.
    // @param d Number representing the current dimension that we are on the tree.
    this._buildTree = function (start, end, d) {
        var median;

        if (end - start <= 0) {
            return;
        }

        this._sort(start, end, d);
        median = Math.floor((start + end) / 2);
        d = (d + 1) % this._k;

        this._buildTree(start, median - 1, d);
        this._buildTree(median + 1, end, d);
    }

    // Sorts pointIndex using Array.sort() hence mergesort between the indices start and end on dimension d.
    // @param start Number representing the start index for pointIndex.
    // @param end Number representing the end index for pointIndex.
    // @param d Number representing the dimension on which we want to sort at.
    this._sort = function (start, end, d) {

        var subArray = this._pointIndex.slice(start, end + 1),
            l = subArray.length,
            that = this;

        subArray.sort(function (i1, i2) {
            if (that._smallerDimVal(that._points[i1], that._points[i2], d)) {
                return -1;
            } else {
                return 1;
            }
        });

        for (var i = 0; i < l; i += 1) {
            this._pointIndex[start + i] = subArray[i];
        }
    }

    // Nearest Neighbor algorithm on kdtrees.
    // Recurse down dimensions to find the best hyperrectangle.
    // Recurse backup to find the closest points within the radius of the best hyperrectangle.
    // @param target Point that we want to find nearest neighbor to.
    // @param currentBest Point that represents the closest point to target so far.
    // @param start Number representing the start index of the subarray.
    // @param end Number representing the end index of the subarray.
    // @param d Number representing the dimension that we are on.
    // @return Point in this._points that is closest to target.
    this._nn = function (target, currentBest, start, end, d) {
        var median = Math.floor((start + end) / 2),
            medianIndex = this._pointIndex[median],
            root = this._points[medianIndex],
            radius, dDistance;

        if (start > end) {
            return currentBest;
        }

        // leaf node
        if (end - start === 0) {
            if (this._shouldReplace(target, currentBest, root)) {
                return root;
            }
            return currentBest;
        } else {
            if (this._smallerDimVal(target, root, d)) {
                // search the left subtree
                currentBest = this._nn(target, currentBest, start, median - 1, (d + 1) % this._k);
                if (this._shouldReplace(target, currentBest, root)) {
                    currentBest = root;
                }

                radius = this._distance(target, currentBest);
//                dDistance = (target.at(d) - root.at(d)) * (target.at(d) - root.at(d));
                dDistance = (target[d] - root[d]) * (target[d] - root[d]);

                if (dDistance <= radius) {
                    currentBest = this._nn(target, currentBest, median + 1, end, (d + 1) % this._k);
                }
            } else {
                // search the right subtree
                currentBest = this._nn(target, currentBest, median + 1, end, (d + 1) % this._k);
                if (this._shouldReplace(target, currentBest, root)) {
                    currentBest = root;
                }

                radius = this._distance(target, currentBest);
//                dDistance = (target.at(d) - root.at(d)) * (target.at(d) - root.at(d));
                dDistance = (target[d] - root[d]) * (target[d] - root[d]);

                if (dDistance <= radius) {
                    currentBest = this._nn(target, currentBest, start, median - 1, (d + 1) % this._k);
                }
            }
            return currentBest;
        }
    }

    // Returns true if the value of point a in dimension d is smaller than the value of point b in dimension d.
    //
    // @param a Point that we want to compare.
    // @param b Point that we want to compare.
    // @param d Number represensting the dimension of the value.
    // @return true if point a has a smaller value than b in dimension d.
    this._smallerDimVal = function (a, b, d) {
//        if (a.at(d) === b.at(d)) {
        if (a[d] === b[d]) {
//            return a.lessThan(b);
            return aLessThanB(a, b);
        } else {
//            return (a.at(d) < b.at(d));
            return (a[d] < b[d]);
        }
    }

    // Returns true if the potential point is closer to the target point.
    // @param target Point that we want to find the distance to.
    // @param currentBest Point that is currently the closest to target in the tree.
    // @param potential Point that can potentially be closer to target than currentBest.
    // @return true if potential is closer to target than currentBest.
    this._shouldReplace = function (target, currentBest, potential) {
        var tcDist = this._distance(target, currentBest);
        var tpDist = this._distance(target, potential);

        if (tcDist === tpDist) {
//            return potential.lessThan(currentBest);
            return aLessThanB(potential,currentBest);
        } else {
            return (tpDist < tcDist);
        }
    }

    // Computes the Euclidian distance between points a and b.
    // @param a Point that represents the start.
    // @param b Point that represents the end.
    // @return Number that represents the distance between points a and b.
    this._distance = function (a, b) {
        var dist = 0.0;

        for (var i = 0; i < this._k; i += 1) {
            dist += ((a[i] - b[i]) * (a[i] - b[i]));
        }

        return dist;
    }

    // Returns a string that represents the tree in a level-by-level fashion.
    // @return String representing the kdtree.
    this.toString = function () {
        var str = "",
            l = this._pointIndex.length,
            start = 0, end = l,
            index, node;

        if (end - start <= 0) {
            return "The tree is empty (>^.^)>";
        }

        for (var i = 0; i < l; i += 1) {
            index = this._pointIndex[i];
            node = this._points[index];
            str += node.toString() + " ";
        }
        return str;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Returns true if all the values of a is smaller than b's.
// @return true if a has smaller values than b, false otherwise.
//this.lessThan = function (p) {
aLessThanB = function (a, b) {
    var less = true;

//        for(var i = 0; i < this._k; i += 1) {
    for (var i = 0; i < 3; i++) {
//            less &= (this.at(i) < p.at(i));
        less &= (a[i] < b[i]);
    }
    return less;
}