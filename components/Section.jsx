import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import {ID_PREFIX_SECTION, ID_PREFIX_PAGE, ID_PREFIX_SORTABLE_BOX, BOX_TYPES} from '../constants';

export default class Section extends Component {
    render() {
        let navItem = this.props.navItems[this.props.id];

         let classSelected = this.props.navItemSelected === navItem.id ? 'selected' : 'notSelected';
        return (
            <div id={this.props.id} className="drag-handle" style={{paddingTop: 10}}onMouseDown={e => {
                this.props.onNavItemSelected(navItem.id);
                e.stopPropagation();
            }}>
                <div className={"navItemBlock " + classSelected}>
                    <span style={{marginLeft: 20*(this.props.navItems[this.props.id].level-1)}}>
                    <button className="expandir" onClick={e => {
                        this.props.onNavItemExpanded(navItem.id, !navItem.isExpanded)
                        e.stopPropagation();
                    }}><i onClick={e => {
                        this.props.onNavItemExpanded(navItem.id, !navItem.isExpanded)
                        e.stopPropagation();}} className={classSelected + '  material-icons'} >{navItem.isExpanded ? "arrow_drop_down" : "play_arrow"}</i></button>

                    <span className={classSelected}style={{display: 'inline'}}><i className={classSelected + '  material-icons'} >folder</i>  {navItem.name}</span>
                    </span>
                </div>
                <div style={{display: (navItem.isExpanded ? 'block' : 'none') }}>
                    
                    <div >
                        <div ref="sortableListS" style={{paddingTop: (navItem.children.length > 0 ? 2 : 5) }} className="sectionList connectedSortables">
                            {
                                navItem.children.map((id, index) => {
                                    if (id.indexOf(ID_PREFIX_SECTION) !== -1) {
                                        return <Section id={id}
                                                        key={index}
                                                        navItemsIds={this.props.navItemsIds}
                                                        navItems={this.props.navItems}
                                                        navItemSelected={this.props.navItemSelected}
                                                        onBoxAdded={this.props.onBoxAdded}
                                                        onPageAdded={this.props.onPageAdded}
                                                        onSectionAdded={this.props.onSectionAdded}
                                                        onNavItemSelected={this.props.onNavItemSelected}
                                                        onNavItemExpanded={this.props.onNavItemExpanded}
                                                        onNavItemReorded={this.props.onNavItemReorded}/>;
                                    } else if (id.indexOf(ID_PREFIX_PAGE) !== -1) {
                                        let classSelected = this.props.navItemSelected === id ? 'selected dragS' : 'notSelected dragS';
                                        let color = this.props.navItemSelected === id ? '#f87060' : '#555';
                                        return <h4  key={index} id={id} className={'navItemBlock ' + classSelected} onMouseDown={e => {
                                                 this.props.onNavItemSelected(id);
                                                 e.stopPropagation();}}>
                                                <span style={{marginLeft: 20*(this.props.navItems[id].level-1)}}>
                                                    <i className="material-icons">insert_drive_file</i>{this.props.navItems[id].name}
                                                </span>
                                               </h4>;
                                    }
                                })}
                         </div>
                      </div>
                </div>
            </div>
        );
    }

    calculatePosition(){

        let navItem = this.props.navItems[this.props.id];
        //let position = Math.max(this.props.navItemsIds.indexOf(navItem.children[navItem.children.length - 1]), 0) + 1;
        var cuenta = 0
        var exit= 0;
        this.props.navItemsIds.map(i=>{
        
            if(exit==0 && this.props.navItems[i].position > navItem.position) {
                if( this.props.navItems[i].level > navItem.level ){
                    cuenta++; return;
                }else{
                    exit==1; return;
                }
            }
        });

        return navItem.position +cuenta + 1;
    }

    calculateName(navItem){

        let siblings = navItem.children
        var sections = 1
        for (let i in siblings){
            if(siblings[i].indexOf(ID_PREFIX_SECTION) !== -1) sections++
        }

        return sections
    }

    componentDidMount(){
        let list = jQuery(this.refs.sortableListS);
        list.sortable({ 
            tolerance: 'intersect',
            connectWith: '.connectedSortables',
            placeholder: "sortable-placeholder",
             over: (event, ui) => {
                console.log(event.target)
                $(".carList").css("border-left", "none");
                $(".sectionList").css("border-top", "none");
                $(event.target).css("border-top", "3px solid #F47920");
            },
            out: (event, ui) => {
                 console.log(event.target)
                    $(".carList").css("border-left", "none");
                  $(".sectionList").css("border-top", "none");
                $(event.target).css("border-top", "none");
            },
            stop: (event, ui) => {
                const reorderedIndexesId = list.sortable('toArray', {attribute: 'id'}); //Obtiene la nueva disposición de elementos por id esta es la válida.
                const selected = this.props.navItemSelected;
                const previos = this.props.navItemsIds;
                const parent =this.props.navItems[selected].parent;
                          
                var oldChilds = this.props.navItems[this.props.id].children; //Saca los hijos del pasado del elemento seleccionado       
                var newChilds = reorderedIndexesId;

                if( newChilds.indexOf(selected) >= 0 && oldChilds.indexOf(selected) >= 0){
                    list.sortable('cancel');
                    
                    var part1 = previos.slice(0,previos.indexOf(parent)+1);
                    var nextBroOfParent;
                    for(var j = previos.indexOf(parent)+1; j<previos.length;j++){
                        if(this.props.navItems[previos[j]].level <= this.props.navItems[parent].level){
                            nextBroOfParent = previos[j];
                            break;
                        }else{
                        }
                    }

                    if(nextBroOfParent){
                        var part2 = previos.slice(previos.indexOf(nextBroOfParent));
                    }else{  
                        var part2 = [];
                    }

                    var selectedAndChildren = [selected];
                    var positionSelected = this.props.navItems[selected].position;
                    var levelSelected = this.props.navItems[selected].level;

                    for(var i = positionSelected+1; i< previos.length; i++){
                        if( this.props.navItems[previos[i]].level <= levelSelected){
                            break;
                        }else{
                            selectedAndChildren.push(previos[i]);
                        }
                    }

                    var part1NCAux = newChilds.slice(0,newChilds.indexOf(selected));
                    var part2NCAux = newChilds.slice(newChilds.indexOf(selected)+1);
                    var part1NC = [];
                    var part2NC = [];
                    var medioA = previos.slice(previos.indexOf(parent)+1, previos.indexOf(selected));

                    if(nextBroOfParent){
                        var medioB = previos.slice(previos.indexOf(selected)+selectedAndChildren.length,previos.indexOf(nextBroOfParent));
                    }else{
                        var medioB = previos.slice(previos.indexOf(selected)+selectedAndChildren.length);
                    }

                    var medio = medioA.concat(medioB);

                    if(part1NCAux.length > 0){
                        if(part2NCAux.length > 0){
                           for(var t = 0; t<medio.length; t++){
                                if(medio[t] == part2NCAux[0]) break;
                                part1NC.push(medio[t]);
                            }

                            part2NC = medio.slice(medio.indexOf(part2NCAux[0]));
                        }else{
                            part1NC = medio;
                        }
                      }else{
                        part2NC = medio;
                    }

                    var newIndexesIds = part1.concat(part1NC,selectedAndChildren,part2NC,part2);

                    this.props.onNavItemReorded(this.props.navItemSelected, this.props.id,3,newIndexesIds,newChilds); 
                }else{
                }       
            }.bind(this),
            receive: (event, ui) => {
                                
                const id = this.props.id;
                const selec = this.props.navItemSelected;
                const parent = this.props.navItems[this.props.navItemSelected].parent;
                const reorderedIndexesId = list.sortable('toArray', {attribute: 'id'})
                const previos = this.props.navItemsIds;

                $(ui.sender).sortable('cancel');
            
                var index = 0;
                var newIndexesIds = [];             

                if(parent !== id){
                    if(parent == 0){
                    
                        var newIndexesIds = [];             
                        var newChildrenInOrder = reorderedIndexesId;
                        var selectedAndChildren = [selec];
                        var levelSelected = this.props.navItems[selec].level;
                        var positionSelected = this.props.navItems[selec].position;

                        for(var i = positionSelected+1; i< previos.length; i++){
                            if( this.props.navItems[previos[i]].level <= levelSelected){
                                break;
                              }else{
                                selectedAndChildren.push(previos[i]);
                            }
                        }

                        var part1 = previos.slice(0,previos.indexOf(selec));
                        var part2 = previos.slice(previos.indexOf(selec)+selectedAndChildren.length);
                        var concatA = part1.concat(part2);

                        if(newChildrenInOrder.length > 1){
                            if(newChildrenInOrder.indexOf(selec) >= newChildrenInOrder.length -1){ 
                                var auxNextElementIndex;
                                for(var j = concatA.indexOf(parent)+1; j<concatA.length; j++){
                                    if(this.props.navItems[concatA[j]].level <= this.props.navItems[parent].level){
                                        auxNextElementIndex = j;
                                        break;
                                      }else{
                                    }
                                }
                                if(auxNextElementIndex){
                                    var part1b = concatA.slice(0, auxNextElementIndex);
                                    var part2b = concatA.slice(auxNextElementIndex);
                                    newIndexesIds = part1b.concat(selectedAndChildren,part2b);
                                  }else{
                                    newIndexesIds = concatA.concat(selectedAndChildren);
                                }  
                              }else{
                                var part1b = concatA.slice(0, concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(selec)+1]));
                                var part2b = concatA.slice(concatA.indexOf(newChildrenInOrder[newChildrenInOrder.indexOf(selec)+1]));
                                newIndexesIds = part1b.concat(selectedAndChildren,part2b);
                            }
                          }else{
                            var part1b = concatA.slice(0, concatA.indexOf(id)+1);
                            var part2b = concatA.slice(concatA.indexOf(id)+1);
                            newIndexesIds = part1b.concat(selectedAndChildren,part2b);
                        }
                        this.props.onNavItemReorded(this.props.navItemSelected, this.props.id,1,newIndexesIds,reorderedIndexesId);

                }else{
                   
                    var newChildrenInOrder = reorderedIndexesId;
                    var selectedAndChildren = [selec];
                    var levelSelected = this.props.navItems[selec].level;
                    var positionSelected = this.props.navItems[selec].position;

                    for(var i = positionSelected+1; i< previos.length; i++){
                        if( this.props.navItems[previos[i]].level <= levelSelected){
                            break;
                          }else{
                            selectedAndChildren.push(previos[i]);
                        }
                    }

                    var part1Aux = previos.slice(0,previos.indexOf(selec));
                    var part2Aux = previos.slice(previos.indexOf(selec)+selectedAndChildren.length);
                    var previosCleaned = part1Aux.concat(part2Aux);

                    var nextBroOfParent;
                    for(var j = previosCleaned.indexOf(id)+1; j<previosCleaned.length;j++){
                        if(this.props.navItems[previosCleaned[j]].level <= this.props.navItems[id].level){
                            nextBroOfParent = previosCleaned[j];
                            break;
                        }else{
                        }
                    }

                    var part1 = previosCleaned.slice(0,previosCleaned.indexOf(id)+1);
                    
                    if(nextBroOfParent){
                        var part2 = previosCleaned.slice(previosCleaned.indexOf(nextBroOfParent));
                    }else{  
                        var part2 = [];
                    }

                    var concatA = part1.concat(part2);

                    if(part2.length>0){
                        var medio = previosCleaned.slice(previosCleaned.indexOf(id)+1,previosCleaned.indexOf(part2[0]));
                    }else{
                        var medio = previosCleaned.slice(previosCleaned.indexOf(id)+1);
                    }

                    var part1NCAux = newChildrenInOrder.slice(0,newChildrenInOrder.indexOf(selec));
                    var part2NCAux = newChildrenInOrder.slice(newChildrenInOrder.indexOf(selec)+1);
                    var part1NC = [];
                    var part2NC = [];

                    if(part1NCAux.length > 0){
                        if(part2NCAux.length > 0){
                           for(var t = 0; t<medio.length; t++){
                                if(medio[t] == part2NCAux[0]) break;
                                part1NC.push(medio[t]);
                            }
                            part2NC = medio.slice(medio.indexOf(part2NCAux[0]));
                        }else{
                            part1NC = medio;
                        }
                      }else{
                        part2NC = medio;
                    }

                    var newIndexesIds = part1.concat(part1NC,selectedAndChildren,part2NC,part2);

                    this.props.onNavItemReorded(this.props.navItemSelected, this.props.id,2,newIndexesIds,newChildrenInOrder); 
                }
            }else{
            }
        }.bind(this)
    }).bind(this);


}

}
