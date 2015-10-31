var showMoreFlag = false;
var chartResult;

/**
 * Number.prototype.format(n, x, s, c)
 * 
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 * http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
 */
Number.prototype.format = function(n, x, s, c) {
	var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')', num = this
			.toFixed(Math.max(0, ~~n));

	return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&'
			+ (s || ','));
};

/**
 * Adds some super simple formatting to Strings. Allows adding {0} {1} and then
 * substitutes arguments at those index those locations
 * 
 * @returns {string}
 */
String.prototype.format = function() {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number) {
		return typeof args[number] != 'undefined' ? args[number] : match;
	});
};

function getWidth(income) {
    var numOfCharacters = income.format().length;
    return numOfCharacters + 4;
}

function formatMoney(number) {
    var result = number < 0 ? "-$" + Math.abs(number).format(0, 3, ',', '.') : "$" + number.format(0, 3, ',', '.');
    if (result.length > 10) {
        var newResult = result.substring(0, 9);
        if (newResult.charAt(8) == ",") {
            newResult = newResult.substr(0, 8)
        }
        newResult = newResult + "...";
        return {result: newResult, rest: result}
    } else {
        return {result: result, rest: result}
    }
}

function formatOutput(destination, value)
{
	var $dest = $(destination);
	var destFormatted = formatMoney(value);
	$dest.text(destFormatted.result);
	$dest.attr("title", destFormatted.rest);
	$dest.powerTip({smartPlacement: true});
};

function scaleBarChart() {
    var textWidthModifier = 12;
    textWidthModifier = Math.max(textWidthModifier, getWidth(data.income_name));
    if(data.income==0 && data.totalSpending()==0) return;
    if (data.income > data.totalSpending()) {
        var totalSpendingRatio = (data.totalSpending() / data.income).toFixed(2) * (100 - textWidthModifier);
        totalSpendingRatio = Math.max(totalSpendingRatio, 1);
        $("#incomeBar").css("width", (100 - textWidthModifier) + "%");
        $("#spendingBar").css("width", totalSpendingRatio + "%");

    } else {
        var incomeRatio = (data.income / data.totalSpending()).toFixed(2) * (100 - textWidthModifier);
        $("#incomeBar").css("width", incomeRatio + "%");
        $("#spendingBar").css("width", (100 - textWidthModifier) + "%");
        
    }
};

var newShadeOfBlue = (function () {
//  var blues = ["#008ABB", "#599CFF", "#005990", "#1034A6", "#0079BE", "#42B0D8", "#88DBF8", "#0985D8", "#5EB1CF", "#b9d2f2"];
  var blues = ["#0098CD", "#005386", "#0076BA", "#86D8F4", "#68C2E5", '#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
      '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']
  var id = 0;
  return function () {
      var color = blues[id];
      id++;
      if (id >= blues.length) {
          id = 0;
      }
      return color
  }
})();

function convertSpendingItems(spending) {
    var result = [];
    var counter = 0;
    spending.forEach(function (item) {
    	if( showMoreFlag || ++counter < 6) {
        result.push({
            value: +item.value,
            y: +item.value,
            color: newShadeOfBlue(),
            label: item.name,
            name: item.name
        })
    	}
    });
    return result;
};

function showTable( chartResult ) {
    var template = $("#listItemTemplate").html();
    var $table = $("#tableLocation");

    
    chartResult.forEach(function (item) {
   		var formatResult = formatMoney(item.value);
        $table.append(template.format(item.color, item.label, formatResult.rest, formatResult.result));
    });
    var label = 'Show all';
    if( showMoreFlag ) {
    	label = 'Show less';
    }
    if(data.spending.length > 5 )
    	$table.append("<div class='row listRow' id='showMore'><a href='#' onClick='showMore()'>"+label+"</a></div>");
    $(".itemMoney").powerTip({
        followMouse: true
    });
};

function drawHighcharts() {
	$('#doughnut').highcharts({
        title: {
            text: ""
        },
        chart: {
            backgroundColor: null,
            margin: [0, 0, 0, 0],
            spacingTop: 0,
            spacingBottom: 0,
            spacingLeft: 0,
            spacingRight: 0,
            width: 150

        },
        credits: {
            enabled: !1
        },
        plotOptions: {
            pie: {
                cursor: "pointer",
                borderWidth: 0,
                dataLabels: {
                    enabled: !1
                },
                showInLegend: !1
            },
            series: {
                states: {
                    hover: {
                        halo: {
                            size: 0
                        }
                    }
                }
            }
        },
        tooltip: {
            backgroundColor: "rgb(51, 51, 51)",
            borderColor: "transparent",
            borderRadius: 10,
            followPointer: !0,
            formatter: function () {
                return '<div class="tooltip-amount">' + formatMoney(this.point.y).result + "</div>" + '<div class="tooltip-label">' + this.point.name.toUpperCase() + "</div>";
            },
            shadow: !1,
            shared: !0,
            useHTML: !0,
            style: {
                padding: 15
            }
        },
        series: [{
            type: "pie",
            name: "Expenses",
            innerSize: "40%",
            data: chartResult,
            slicedOffset: 0

        }]
    });
};

function showMore() {
	showMoreFlag = ! showMoreFlag;
	var $table = $("#tableLocation");
	$table.html('');
	chartResult = convertSpendingItems(data.spending);
	drawHighcharts();
	showTable(chartResult);
};

$(document).ready(function () {

    data.totalSpending = function () {
            var sum = 0;
            this.spending.forEach(function (item) {
                sum += +item.value;
            });
            return sum
    };

    function buildUI() {

        formatOutput(".profit", data.income - data.totalSpending());
        formatOutput(".spending", data.totalSpending());
        formatOutput(".income", data.income);

        var $incomeBar = $("#incomeBar");
        var $spendingBar = $("#spendingBar");
        $incomeBar.data("powertip", "<div class='tooltip-amount'>" + formatMoney(data.income).rest + "</div><div class='tooltip-label'>"+data.income_name+"</div>");
        $spendingBar.data("powertip", "<div class='tooltip-amount'>" + formatMoney(data.totalSpending()).rest + " </div><div class='tooltip-label'>SPENDING</div>");

        chartResult = convertSpendingItems(data.spending);
        
        drawHighcharts();

        showTable(chartResult);
        

        scaleBarChart();
        $("#barChart").resize(function () {
            scaleBarChart()
        });

        $incomeBar.powerTip({
            followMouse: true,
            intentPollInterval: 10
        });

        $spendingBar.powerTip({
            followMouse: true,
            intentPollInterval: 10
        });
    }

    buildUI();
});
