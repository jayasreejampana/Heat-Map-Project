let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let req =  new XMLHttpRequest();
let values = [];
let baseTemp;

let xScale;
let yScale;

let width =1200;
let height = 600;
let padding = 60;

let minYear;
let maxYear;
let widthLength;

let svg = d3.select('#canvas')
svg.attr('width',width);
svg.attr('height',height);

let tooltip = d3.select('#tooltip')


let generateScales = () => {
  minYear = d3.min(values,(d)=> d['year']);
  maxYear = d3.max(values,(d)=>d['year']);
  xScale = d3.scaleLinear()
             .domain([minYear,maxYear+1])
             .range([padding,width-padding])
  yScale = d3.scaleTime()
              .domain([new Date(0 ,0 ,0 ,0 ,0 ,0 ,0),new Date(0 ,12 ,0 ,0 ,0 ,0 ,0)])
             .range([padding,height-padding])

}

let drawCells = () => {
  svg.selectAll('rect')
      .data(values)
      .enter()
      .append('rect')
      .attr('class','cell')
      .attr('fill',(d)=> {
           variance = d['variance']
           if(variance <= -1) {
             return '#3797a4';
           }else if(variance <=0) {
             return '#8bcdcd';
           }else if(variance <=1) {
             return '#f9813a';
           }else{
             return '#ec0101';
           }
      })
      .attr('data-year',(d)=>{
        return d['year'];
      })
      .attr('data-month',(d)=>{
        return (d['month']-1);
      })
      .attr('data-temp',(d)=>{
        return baseTemp + d['variance'];
      })
      .attr('height',(height-(2 * padding))/12)
      .attr('y',(d)=> {
        return yScale(new Date(0,d['month']-1,0,0,0,0,0));
      })
      .attr('width',(d)=> {
          widthLength = maxYear - minYear
          return (width-(2 * padding))/widthLength;
      })
      .attr('x', (d) => {
            return xScale(d['year'])
        })
      .on('mouseover', (d) => {
            tooltip.transition()
                .style('visibility', 'visible')

            let monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
            ]

            tooltip.text(d['year'] + ' ' + monthNames[d['month'] -1 ] + ' : ' + d['variance'])

            tooltip.attr('data-year', d['year'])
        })
        .on('mouseout', (d) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })
}

let drawAxis = () => {
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))
  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%B'))
  svg.append('g').call(xAxis).attr('id','x-axis').attr('transform','translate(0,' + (height-padding) + ')')
  svg.append('g').call(yAxis).attr('id','y-axis').attr('transform','translate(' + padding + ',0)')
}
req.open('GET', url , true);
req.onload = () => {
  let object = JSON.parse(req.responseText);
  baseTemp = object['baseTemperature'];
  values =  object['monthlyVariance'];
  generateScales();
  drawCells();
  drawAxis();
}
req.send();
