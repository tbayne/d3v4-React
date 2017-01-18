import React, { Component } from 'react';
import _ from 'lodash';
import * as d3 from 'd3';

function getData() {
    const range = 100;
    const data = {
            nodes:d3.range(0, range).map(function(){ return {label: "link",r:~~d3.randomUniform(8, 28)()}}),
            links:d3.range(0, range).map(function(){ return {source:~~d3.randomUniform(range)(), target:~~d3.randomUniform(range)()} })        
        }
    return data;
  }

function D3blackbox(D3render) {
  return class Blackbox extends React.Component {

    componentDidMount() { D3render.call(this); }
    componentDidUpdate() { D3render.call(this) }

    render() {
        
        const val = <g ref="anchor" />;
        return val;
    }
  }
}


class NetworkGraph extends Component {

    constructor(props) {
        super(props);
        // Setup the properties for the graph
        // This means nodes and (possibly) links.
        this.state = {nodes: props.nodes, links: props.links, nodeg: null, linkg: null, fs: null};
    }

    componentWillReceiveProps(newProps) {
        console.log("componentWillReceiveProps");
    }

    ticked() {
        let nodesg1 = d3.select(this.refs.anchor).selectAll();
        console.log("ticked(): ", nodesg1);
        if (this.state) {
            let {nodeg, linkg} = this.state;
            

            nodeg
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            linkg
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
            this.setState({nodeg: nodeg, linkg: linkg})
        }
    }
    
    dragstarted= (d) => {
            if (!d3.event.active) this.fs.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
    dragged = (d) => {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        
    dragended = (d) => {
            if (!d3.event.active) this.fs.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        } 


    D3renderer = () =>
    {
        const width="800";
        const height="600"
        let data = getData();
        let fs = d3.forceSimulation()
                .force("link", d3.forceLink().distance(20).strength(-200))
                .force("charge", d3.forceManyBody())
                .force("center", d3.forceCenter(width / 2, height / 2))
                //.force("link",data.links)
                .nodes(data.nodes)
                .on("tick", this.ticked);
                //.start()
                
        let g_nodes = d3.select(this.refs.anchor).append("g");
        g_nodes.attr("class","nodes")
            .selectAll("circle")
            .data(data.nodes)
            .enter().append("circle")
            .attr("r", function(d) {return d.r})
            .call(d3.drag()
            .on("start", this.dragstarted)
            .on("drag", this.dragged)
            .on("end", this.dragended)); 

        let g_links = d3.select(this.refs.anchor).append("g");
        g_links.attr("class","links")
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .attr("stroke", "black")

        d3.select(this.refs.anchor)
            .call(fs);

        this.setState({fs : fs, nodeg: g_nodes, linkg: g_links});
    };


    


    render() {
        let _this = this;
        let NetGraph = D3blackbox(this.D3renderer);

        return (
            <g>
                <NetGraph />
            </g>
            );
        }
    
}

export default NetworkGraph;