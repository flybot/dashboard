<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Dashboard</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css" integrity="sha384-aUGj/X2zp5rLCbBxumKTCw2Z50WgIr1vs/PFN4praOTvYXWlVyh2UtNUU0KAUhAX" crossorigin="anonymous">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-powertip/1.2.0/css/jquery.powertip-dark.css">

    <script src="//code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js" integrity="sha512-K1qjQ+NcF2TYO/eI3M6v8EiNYZfA95pQumfvcVrTHtwQVDG+aHRqLi/ETn2uB+1JqwYqVG3LIvdm9lj6imS/pQ==" crossorigin="anonymous"></script>
    <script src="//code.highcharts.com/highcharts.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-powertip/1.2.0/jquery.powertip.min.js"></script>
    <link rel="stylesheet" href="css/dashboard.css">

    <script type="text/template" id="listItemTemplate">
        <div class="row listRow">
            <div class="col-xs-1 colorSwatch" style="background:{0}"></div>
            <div class="col-xs-5 itemListText">
                {1}
            </div>
            <div class="col-xs-3 itemMoney" title="{2}">
                {3}
            </div>
        </div>
    </script>
    
	<script src="js/dashboard.js"></script>

</head>
<body class="container">

<div class="row">
    <div class="col-md-3 totalText">
        <div class="bigNumberWrapper">
            <span class="profit" id="mainProfit">-$9999</span>
        </div>
        <div class="infoText1">
            <p>
                BUSINESS PROFIT
            </p>

            <p>
                YEAR TO DATE
            </p>
        </div>
    </div>


    <div class="col-md-9">
        <div id="barChart">
            <div class="row barChartRow">
                <div class="col-md-12" id="incomeBarWrapper">
                    <div id="incomeBar" class="bar"></div>
                    <div class="barCharLegend">
                        <div class="row"><span class="income">-9999</span></div>
                        <div class="row infoText2">[@income_name]</div>
                    </div>
                </div>
            </div>
            <div class="row barChartRow">
                <div class="col-md-12" id="spendingBarWrapper">
                    <div id="spendingBar" class="bar"></div>
                    <div class="barCharLegend">
                        <div class="row"><span class="spending">-9999</span></div>
                        <div class="row infoText2">SPENDING</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<hr>

<div class="row">
    <div class="col-sm-3 totalText">
        <div class="bigNumberWrapper">
            <span id="mainSpending" class="spending">-$9999</span>
        </div>
        <div class="infoText1">
            <p>
                BUSINESS SPENDING
            </p>

            <p>
                YEAR TO DATE
            </p>
        </div>
    </div>

    <div class="col-sm-6" id="tableLegend">
        <div id="tableLocation"></div>
    </div>
    <div id="doughnut"></div>
</div>

<script type="text/javascript">
	var data = {
        income: [@income],
        income_name: "[@income_name]",
        spending: [@spending],
    };
</script>

</body>
</html>