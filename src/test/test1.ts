const Manager = function (name, sales) {
    this.name = name;
    this.sales = sales;
    this.sell = (thing) => {
        this.sales += 1;
        return 'Manager ' + this.name + ' sold ' + thing;
    };
    this.sell2 = function (thing) {
        this.sales += 1;
        return 'Manager2 ' + this.name + ' sold ' + thing;
    };
    function b() {
        console.log(this); // global
    }
    b();
};
const Manager1 = new Manager('John', 10);
const mary = new Manager('Mary', 120);
console.log(Manager1.sell('aaa'));
console.log(Manager1.sell2('aaa2'));
console.log(mary.sell('bbb'));


const a = {
    name: 'asd',
    sell: function (thing) {
        this.sales += 1;
        return 'Manager ' + this.name + ' sold ' + thing;
    }
}

console.log(a.sell('ccc'));