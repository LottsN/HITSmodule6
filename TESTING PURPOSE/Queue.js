function Queue() {
    var a = [], b = 0;

    this.getLength = function () {
        return a.length - b
    };

    this.isEmpty = function () {
        return 0 == a.length
    };

    this.enqueue = function (b) {
        a.push(b);
        a.sort(function(a,b){
            if(a.f > b.f) return 1;
            if(a.f < b.f) return -1;
            return 0;
        });
    };

    this.dequeue = function () {
        var i = a.shift();
        return i;
    };
};

function triplet(F, X, Y) {
    this.f = F;
    this.x = X;
    this.y = Y;
}

var q = new Queue();

test = new triplet(3.5, 1, 0);
q.enqueue(test);
test = new triplet(5.5, 0, 1);
q.enqueue(test);

var total = q.dequeue();

console.log(total.f);
console.log("(", total.x, ",", total.y, ") with f of ", total.f);

test = new triplet(3, 2, 0);
q.enqueue(test);

test = new triplet(5, 1, 1);
q.enqueue(test);

var total = q.dequeue();
console.log("(", total.x, ",", total.y, ") with f of ", total.f);

test = new triplet(2.5, 3, 0);
q.enqueue(test);

test = new triplet(4.5, 2, 1);
q.enqueue(test);

var total = q.dequeue();
console.log("(", total.x, ",", total.y, ") with f of ", total.f);
