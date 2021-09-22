export function receiptTotal(data) {
    var total = 0;
    data.map(p => {
        var price = parseFloat(p.price);
        total += price;
    })
    return total;
}

export function monthlyAnnual(data, month, year) {
    
    var total = 0;
   
    data.map(p => {
        var intYear = parseInt(year);
        console.log(intYear == p.year, typeof intYear, typeof p.year)
        if(p.month == month && parseInt(p.year) == year)
        {
            var price = parseFloat(p.price);
            total += price;
        }
            
    })
    return total;
}

export function noEmployee(data, year) {
    var total = 0;
    data.map(p => {
        if(p.year == year) {
            total += 1;
        }
    })
    // returneaza numarul total de angajati dintr-un an
    return total;
}

export function annualSalary(data, year) {
    var total = 0;
    data.map(p => {
        if(p.year == year) {
            total += parseFloat(p.salary);
        }
    })
    return total;
}