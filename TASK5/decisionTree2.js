var type;
var names;
var now = [];
var tmp = [];
var vec = [];
var vis;
var canvas = document.querySelector("canvas");
console.log("window width: ", window.innerWidth);
console.log("widnow height: ", window.innerHeight);
canvas.width = window.innerWidth * 0.57;
canvas.height = window.innerHeight * 0.87;
var ctx = canvas.getContext("2d");
var height;                                                         //height of attribute label in tree
var width;                                                          //width of attribute label in tree

//returns entroy of subattribute
function entr(pos, neg) {
    var c = pos + neg;
    if (pos == 0 || neg == 0) {
        return 0;
    }
    var t1 = Math.log2(pos / c);
    var t2 = Math.log2(neg / c);
    return -(pos / c) * t1 - (neg / c) * t2;
}

//returns information expectation
function Info(now, k) {
    var res = 0;
    for (let i = 0; i < type[k].length; i++) {
        var c1 = 0, c2 = 0, tot = now[k].length;
        var s = type[k][i];
        for (let j = 1; j < now[k].length; j++) {
            if (now[k][j] === s) {
                c1++;
                if (now[now.length - 1][j] === "no") {
                    c2++;
                }
            }
        }

        res += (c1 / tot) * entr(c1 - c2, c2)
    }

    return res;
}

//initializes list of attributes and subattributes
function init() {
    type = new Array(csvCell[1].length);
    names = new Array(csvCell[1].length);

    for (let i = 1; i < type.length; i++) {
        type[i] = [];
        names[i] = csvCell[0][i];                       //stores name of attribute

        for (let j = 1; j < csvCell.length; j++) {
            var found = false;
            //checking is subattribute is already in use
            for (let k = 0; k < type[i].length; k++) {
                if (csvCell[j][i] === type[i][k]) {
                    found = true;
                    break;
                }
            }

            //add new subattribute
            if (found == false) {
                type[i].push(csvCell[j][i]);
            }
        }
    }

    //calculating worst case dimensions for tree label's (gives idea of how well the algorithm works (difference between algorithm and brute force))
    height = (canvas.height * 0.96) / (type.length - 1 + ((type.length - 2) * 2));

    console.log("number of attributes: ", type.length);

    var nb_subattribute = 1;
    //calculates worst case number of subattributes
    for (let i = 1; i < type.length; i++) {
        nb_subattribute *= type[i].length;
    }

    console.log("subattributes : ", nb_subattribute);
    /*width = canvas.width / (nb_subattribute + ((nb_subattribute + 1) * 0.5));*/
    width = height * 3;
}

//rebuilds table as we go deeper into the tree
function build(now, tmp, k, s) {
    console.log("looking for how many rows ", s, " conquers");

    for (let i = 1; i < now.length; i++) {
        tmp[i] = [];
    }

    for (let i = 1; i < now[k].length; i++) {
        //console.log("checking if ", now[k][i], " fits the description");
        if (now[k][i] === s) {
            //console.log("pushed ", i, "th row");
            for (let j = 1; j < now.length; j++) {
                tmp[j].push(now[j][i]);
            }
        }
    }
}

//checks if subattribute is pure (is either fully positive or fully negative)
function judge(tmp, u, s) {
    //console.log("Judging ", s, "for ", tmp[u].length, " rows");
    var pos = 0, neg = 0, tot = 0;
    for (let i = 1; i < tmp[u].length; i++) {
        if (tmp[u][i] == s) {
            tot++;
            if (tmp[tmp.length - 1][i] == "yes") {
                pos++
            }
            else {
                neg++;
            }
        }
    }

    if (pos == tot) {
        return 1;
    }
    else if (neg == tot) {
        return 0;
    }
    else {
        return -1;
    }
}

function ID3(u, dep, now, tmp, start, end) {
    //add names[u] to root of tree
    drawLabel(start, end, dep, names[u], type[u]);

    for (let i = 0; i < type[u].length; i++) {
        build(now, tmp, u, type[u][i]);                 //rebuild the map
        var flag = judge(tmp, u, type[u][i]);           //judge whether subattribute is pure (returns 1 if purely positive, 0 if purely negative and -1 if impure)
        //add type[u][i] as child to root
        console.log("Flag is :", flag);
        if (flag != -1) {
            if (flag == 1) {
                //add YES label
                drawDecision(start, end, dep, "YES", type[u].length, i);

            }
            else {
                //add NO label
                drawDecision(start, end, dep, "NO", type[u].length, i);
            }

            continue;
        }

        var ans;
        var mi = Infinity;
        for (let j = 1; j < now.length - 1; j++) {
            //when attribute has been already counted
            if (vis[j] == 1) {
                continue;
            }

            var c = Info(tmp, j);
            if (c < mi) {
                mi = c;
                ans = j;
            }
        }
        vis[ans] = 1;

        //initalizing start and end of canvas partition
        console.log("original start point is at ", start);
        console.log("original end point is at ", end);
        console.log("current attribute position is ", i + 1);
        var tmp_start = start + ((end - start) / type[u].length) * i;
        var tmp_end = tmp_start + ((end - start) / type[u].length); 
        console.log("start point is at ", tmp_start);
        console.log("end point is at ", tmp_end);

        ID3(ans, dep + (height * 3), tmp, vec, tmp_start, tmp_end);
        vis[ans] = 0;
    }
}

function generateCompactTree() {
    console.log("csvCell number of rows : ", csvCell.length);
    console.log("csvCell number of columns : ", csvCell[1].length);

    init();

    //inverting columns and rows, making i columns and j rows
    for (let i = 1; i < csvCell[1].length; i++) {
        now[i] = [];
        for (let j = 1; j < csvCell.length; j++) {
            now[i][j] = csvCell[j][i];
        }
    }

    //add temporary array (copy of now array)
    for (let i = 1; i < csvCell[1].length; i++) {
        tmp[i] = [];
        for (let j = 1; j < csvCell.length; j++) {
            tmp[i][j] = csvCell[j][i];
        }
    }

    var ans;
    var mi = Infinity;
    for (let i = 1; i < now.length - 1; i++) {
        var c = Info(tmp, i);
        console.log("information expectation of ", names[i], " is :", c);
        //the lower the information expectation, the higher the informational gain
        if (c < mi) {
            mi = c;
            ans = i;
        }
    }

    vis = new Array(now.length);
    vis[ans] = 1;
    ID3(ans, 0.02 * height, now, tmp, 0, canvas.width);

    //testing
    console.log("width of canvas: ", canvas.width, " height of canvas: ", canvas.height);
    console.log("label width: ", width, " label height: ", height);
}