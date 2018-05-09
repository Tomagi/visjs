import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpService, GraphData } from './service/http.service';
import { DataSet, DataItem, Network, Options, Data, Edge, Node } from 'vis';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [HttpService]
})
export class AppComponent implements OnInit {

  @ViewChild('container') graphContainer: ElementRef;
  loginData: any = {};
  graphData: GraphData;

  constructor(private http: HttpService) {
  }

  ngOnInit() {
    this.http.login().subscribe((res: any) => {
      this.loginData = (res && res.body ? res.body.status : 'failure');
      console.log('login response', res);
      this.http.getData().subscribe(res => {
        console.log('getData results', res);
        this.graphData = res;
        this.buildGraph();
      });
    });
  }

  buildGraph() {

    let data: Data = this.buildGraphData();

    let options: Options = {
      layout: {
        improvedLayout: true,
        hierarchical: {
          enabled: true,
          levelSeparation: 300,
          nodeSpacing: 150,
          treeSpacing: 150,
          blockShifting: true,
          edgeMinimization: false,
          parentCentralization: false,
          direction: 'UD',        // UD, DU, LR, RL
          sortMethod: 'directed'   // hubsize, directed
        }
      },
      groups: {
        d: {
          shape: 'square',
          color: {
            background: '#d8d6d6',
            border: '#464343'
          },
          borderWidth: 2,
          size: 25,
        },
        p: {
          shape: 'circle',
          color: {
            background: 'lightpink',
            border: '#464343'
          },
          borderWidth: 1,
          size: 50
        },
      },
      width: '1000px',
      height: '700px',
      edges: {
        color: {
          color: 'grey'
        },
        arrows: {
          to: { enabled: true, scaleFactor: 1, type: 'arrow' },
        },
        arrowStrikethrough: false,
      },
      nodes: {
        fixed: {
          y: false,
          x: false
        },
        font: {
          background: 'white',
          color: 'black',
          size: 16,
          align: 'center'
        },
      },
      interaction: {
        dragNodes: false,
        dragView: true,
        hideEdgesOnDrag: false,
        hideNodesOnDrag: false,
        hover: false,
        hoverConnectedEdges: true,
        multiselect: false,
        navigationButtons: false,
        selectable: false,
        selectConnectedEdges: false,
        tooltipDelay: 300,
        zoomView: true
      }
    }

    let networkGraph = new Network(this.graphContainer.nativeElement, data, options);
    networkGraph.fit();
  }

  buildGraphData() {

    let graphNodes: Node[] = [];
    let graphEdges: Edge[] = [];

    // device elements creation
    let x = 50;
    graphNodes = this.graphData.incoming_devices.map(device => {
      return {
        id: device.deviceId,
        label: device.deviceId,
        group: 'd',
        level: 1
        //x: x += 150,
        //y: 100,
      };
    });

    // protocols elements creation
    x = 50;
    graphNodes = graphNodes.concat(this.graphData.incoming_protocols.map(protocol => {
      return {
        id: protocol.name,
        label: protocol.name,
        group: 'p',
        level: 2
        //x: x += 150,
        //y: 500,

      };
    }));

    // connections creation
    let linkId = 1;
    graphEdges = this.graphData.incoming_links.map(link => {
      return { id: linkId++, from: link.from, to: link.to };
    });

    //graphEdges.push({id:800, from:"10.12.14.4", to:"TCP/445"});

    let data: Data = {
      nodes: graphNodes,
      edges: graphEdges
    };

    return data;
  }
}
