import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
export function ContainerReact() {
    return {
        getRenderTemplate: function(state, id, props) {
            let content = [];
            for (let i = 0; i < state.nBoxes; i++) {
                content.push(
                    <div className={"row"}>
                        <div className={"col-xs-2 h3"}>{i + 1}</div>
                        <div className={"col-xs-10"}>
                            <VisorPluginPlaceholder {...props} key={i + 1} pluginContainer={"Respuesta" + (i + 1)} />
                        </div>
                    </div>);

            }

            return <div><h1>Ejercicio</h1>
                <div className={"row"}>
                    <div className={"col-xs-12"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Pregunta"}/>
                    </div>
                    {content}
                </div>
            </div>;
        },
    };
}
