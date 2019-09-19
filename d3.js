import React, { Component } from 'react';
import * as d3 from 'd3';

class StackedBarChart extends Component {
  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    const data = [
      {
        Category: 'label_a',
        type1: 12,
        type2: 52,
        type3: 34,
        type4: 16,
      },
      {
        Category: 'label_b',
        type1: 93,
        type2: 47,
        type3: 83,
        type4: 9,
      },
      {
        Category: 'label_c',
        type1: 15,
        type2: 36,
        type3: 80,
        type4: 30,
      },
      {
        Category: 'label_d',
        type1: 100,
        type2: 10,
        type3: 50,
        type4: 100,
      },
    ];

    const w=500; const h=500; const padding=40;
    const svg=d3.select('body').append('svg')
          .attr('width', w)
          .attr('height', h);
    d3.stack()
          .keys(['type1', 'type2', 'type3', 'type4']);

    const datasets=[d3.stack().keys(['type1', 'type2'])(data),
            d3.stack().keys(['type3', 'type4'])(data)];

    const num_groups=datasets.length;

    const xlabels=data.map((d) => d.Category);

    const xscale=d3.scaleBand()
            .domain(xlabels)
            .range([padding, w-padding])
            .paddingInner(0.5);

    d3.min(datasets.flat().map((row) => d3.min(row.map((d) => d[1]))));
    const ydomain_max=d3.max(datasets.flat().map((row) => d3.max(row.map((d) => d[1]))));

    const yscale=d3.scaleLinear()
            .domain([0, ydomain_max])
            .range([h-padding, padding]);

      const accent = d3.scaleOrdinal(d3.schemeBlues[6]);
    const xaxis=d3.axisBottom(xscale);
    const yaxis=d3.axisLeft(yscale);

    d3.range(num_groups).forEach((gnum) => {
      svg.selectAll('g.group'+gnum)
        .data(datasets[gnum])
        .enter()
        .append('g')
          .attr('fill', accent)
          .attr('class', 'group'+gnum)
        .selectAll('rect')
        .data(d => d)
        .enter()
        .append('rect')
          .attr('x', (d, i) => xscale(xlabels[i])+(xscale.bandwidth()/num_groups)*gnum)
          .attr('y', d => yscale(d[1]))
          .attr('width', xscale.bandwidth()/num_groups)
          .attr('height', d => yscale(d[0])-yscale(d[1]));
        });

    svg.append('g')
        .attr('class', 'axis x')
        .attr('transform', 'translate(0,'+(h-padding)+')')
      .call(xaxis);
    svg.append('g')
        .attr('class', 'axis y')
        .attr('transform', 'translate('+padding+',0)')
      .call(yaxis);
      }
  render() {
    return <div id={'#' + this.props.id} />;
  }
}

export default StackedBarChart;
