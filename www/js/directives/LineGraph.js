(function() {   
  var app = angular.module('lineGraph',['ionic']);
  app.directive('lineChart',function() {
    var directiveReturnObject = {
      restrict: 'E',
      replace: true,
      link: function(scope,element,attrs) {
        
        var w = 500;
        var h = 200;
        var padding = 40;

        var svg = d3.select('p')
              .append("svg")
              .style("width",w)
              .attr("height",h);

        scope.render = function(amountData,settings) {

          var dataset = [];
          if(settings.groupBy == "Do not group") {
            for(var i = 0;i < amountData.length; i++) {
             dataset[i] = amountData[i].amount;
            };
          }
          else {
            for(x in amountData) {
              dataset.push(amountData[x].amount);
            };
          }
          svg.selectAll("g.axis").remove();
          svg.selectAll("circle").remove();
          svg.selectAll("path").remove();
          svg.selectAll("line").remove();
          var xScale = d3.scale.linear()
                .domain([0,dataset.length])
                .range([padding,w-padding]);

          var yScale = d3.scale.linear()
                  .domain([0,d3.max(dataset)])
                  .range([h-padding,padding]);

          var pointColor = function(y) {
            if(y>yScale(min) || y<yScale(max))
            {
              return "red";
            }
            else
            {
              return "green";
            }
          };

          var lineFunction = d3.svg.line()
                      .x(function(d,i) { return xScale(i); })
                      .y(function(d) { return yScale(d); })
                      .interpolate("linear");

          var lineGraph = svg.append("path")
                    .attr("d", lineFunction(dataset))
                    .attr("stroke","green")
                    .attr("stroke-width",2)
                    .attr("fill","none");

          var dataPoints = svg.selectAll("circle")
                    .data(dataset)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d,i) { return xScale(i); } )
                    .attr("cy", function(d) { return yScale(d); } )
                    .attr("r",3)
                    .attr("fill","orange")
                    .attr("stroke-width",1)
                    .attr("stroke","maroon");

          svg.append("line")
            .attr("x1",padding)
            .attr("x2",w-padding)
            .attr("y1",yScale(settings.limitMax))
            .attr("y2",yScale(settings.limitMax))
            .style("stroke-dasharray",("5,3"))
            .attr("stroke","red")
            .attr("stroke-width",1);
            

          var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .ticks(5);

          svg.append("g")
            .attr("class","axis")
            .attr("transform","translate(0," + (h - padding) + ")")
            .call(xAxis);

          var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left")
                  .ticks(5);

          svg.append("g")
            .attr("class","axis")
            .attr("transform","translate(" + padding + ",0)")
            .call(yAxis);

        };       

        scope.$watch('updateGraph',function(){
          scope.render(scope.displayData,scope.settings);
        },true);
      }

    };
    return directiveReturnObject;
  });
})();