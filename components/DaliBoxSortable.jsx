import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';
import interact from 'interact.js';
import DaliBox from '../components/DaliBox';
import {ID_PREFIX_SORTABLE_CONTAINER} from '../constants';

export default class DaliBoxSortable extends Component{
    render(){
        let box = this.props.boxes[this.props.id];
        return(
        <div onClick={e => {
            e.stopPropagation();
            this.props.onBoxSelected(this.props.id)}}>
            <div ref="sortableContainer"
                 style={{position: 'relative'}}>
                {box.children.map((idContainer, index)=>{
                    let container = box.sortableContainers[idContainer];
                    return (<div key={index}
                                 className="daliBoxSortableContainer"
                                 data-id={idContainer}
                                 style={{
                                    width: '100%',
                                    minHeight: 150,
                                    height: container.height,
                                    border: '1px solid #999',
                                    boxSizing: 'border-box',
                                    position: 'relative'}}>
                        {container.colDistribution.map((col, i) => {
                        if(container.cols[i]) {
                            return (
                                <div key={i}
                                     style={{width: col + "%", height: '100%', float: 'left'}}>
                                    {container.cols[i].map((row, j) => {
                                        return (<div key={j}
                                                     style={{width: "100%", height: row + "%", position: 'relative'}}
                                                     ref={e => {
                                                        if(e !== null){
                                                            let selector = ".rib, .dnd" + idContainer;
                                                            interact(ReactDOM.findDOMNode(e)).dropzone({
                                                                accept: selector,
                                                                overlap: 'pointer',
                                                                ondropactivate: function (e) {
                                                                    e.target.classList.add('drop-active');
                                                                },
                                                                ondragenter: function(e){
                                                                    e.target.classList.add("drop-target");
                                                                },
                                                                ondragleave: function(e){
                                                                    e.target.classList.remove("drop-target");
                                                                },
                                                                ondrop: function(e){
                                                                    if(e.relatedTarget.className.indexOf("rib") !== -1){
                                                                        let initialParams = {
                                                                            parent: this.props.id,
                                                                            container: idContainer,
                                                                            col: i,
                                                                            row: j
                                                                        };
                                                                        Dali.Plugins.get(e.relatedTarget.getAttribute("name")).getConfig().callback(initialParams);
                                                                    } else {
                                                                        let boxDragged = this.props.boxes[this.props.boxSelected];
                                                                        if(boxDragged && (boxDragged.col !== i || boxDragged.row !== j)){
                                                                            this.props.onBoxDropped(this.props.boxSelected, j, i);
                                                                        }
                                                                    }
                                                                }.bind(this),
                                                                ondropdeactivate: function (e) {
                                                                    e.target.classList.remove('drop-target');
                                                                    e.target.classList.remove('drop-active');
                                                                }
                                                            });
                                                        }
                                                    }}>
                                            {container.children.map((idBox, index) => {
                                                if(this.props.boxes[idBox].col === i && this.props.boxes[idBox].row === j) {
                                                    return (<DaliBox id={idBox}
                                                                     key={index}
                                                                     boxes={this.props.boxes}
                                                                     boxSelected={this.props.boxSelected}
                                                                     boxLevelSelected={this.props.boxLevelSelected}
                                                                     toolbars={this.props.toolbars}
                                                                     onBoxSelected={this.props.onBoxSelected}
                                                                     onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                                                     onBoxMoved={this.props.onBoxMoved}
                                                                     onBoxResized={this.props.onBoxResized}
                                                                     onBoxDeleted={this.props.onBoxDeleted}
                                                                     onBoxDropped={this.props.onBoxDropped}
                                                                     onBoxModalToggled={this.props.onBoxModalToggled}
                                                                     onTextEditorToggled={this.props.onTextEditorToggled}/>);
                                                }
                                            })}</div>);
                                    })}
                                </div>);
                        }})}
                        <div style={{position: 'absolute', bottom: 0}}>
                            <i style={{verticalAlign: 'middle'}} className="fa fa-bars fa-2x drag-handle"></i>
                        </div>
                    </div>);
                })}
            </div>
            <div style={{textAlign:'center', minHeight: 100}}>
                Drag content here
            </div>
        </div>
        );
    }

    componentDidMount(){
        interact(".daliBoxSortableContainer").dropzone({
            accept: '.rib',
            overlap: 'center',
            ondropactivate: function (event) {
                event.target.classList.add('drop-active');
            },
            ondragenter: function(event){
                event.target.classList.add("drop-target");
            },
            ondragleave: function(event){
                event.target.classList.remove("drop-target");
            },
            ondrop: function (event) {
                //addBox
                let initialParams = {
                    parent: this.props.id,
                    container: event.target.getAttribute("data-id")
                };
                Dali.Plugins.get(event.relatedTarget.getAttribute("name")).getConfig().callback(initialParams);
                event.dragEvent.stopPropagation();
            }.bind(this),
            ondropdeactivate: function (event) {
                event.target.classList.remove('drop-active');
                event.target.classList.remove("drop-target");
            }
        })
        .resizable({
            edges: {left: false, right: false, bottom: true, top: false},
            onmove: (event) => {
                event.target.style.height = event.rect.height + 'px';
            },
            onend: (event) => {
                this.props.onSortableContainerResized(event.target.getAttribute("data-id"), this.props.id, parseInt(event.target.style.height));
            }
        });

        interact(ReactDOM.findDOMNode(this)).dropzone({
            accept: '.rib',
            overlap: 'center',
            ondropactivate: function (event) {
                event.target.classList.add('drop-active');
            },
            ondragenter: function(event){
                event.target.classList.add("drop-target");
            },
            ondragleave: function(event){
                event.target.classList.remove("drop-target");
            },
            ondrop: function (event) {
                //addBox
                let initialParams = {
                    parent: this.props.id,
                    container: ID_PREFIX_SORTABLE_CONTAINER + Date.now()
                };
                Dali.Plugins.get(event.relatedTarget.getAttribute("name")).getConfig().callback(initialParams);
                event.dragEvent.stopPropagation();
            }.bind(this),
            ondropdeactivate: function (event) {
                event.target.classList.remove('drop-active');
                event.target.classList.remove("drop-target");
            }
        });

        let list = jQuery(this.refs.sortableContainer);
        list.sortable({ handle: '.drag-handle' ,
            stop: (event, ui) => {
                const reorderedIndexes = list.sortable('toArray', {attribute: 'data-reactid'}) // Obtiene la nueva disposición de los elementos
                const indexes = reorderedIndexes.map(el => el.split('$')[2]) //Coge solo la parte que indica el orden
                list.sortable('cancel') //Evita que se reordenen para que gestione la llamada Redux
                this.props.onBoxReorder(indexes, this.props.id) // Cambia el estado pasando como parámetro el id del sortable y el nuevo orden de los elementos. Ahora el orden también se puede UNDO y REDO
        }});
    }

}