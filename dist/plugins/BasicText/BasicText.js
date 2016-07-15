Dali.Plugins["BasicText"] = function (base) {
    return {
        getConfig: function () {
            return {
                name: 'BasicText',
                category: 'text',
                needsConfigModal: false,
                needsTextEdition: true,
                icon: 'format_color_text'
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {

                        basic: {
                            __name: "Basic",
                            buttons: {
                                fontSize: {
                                    __name: 'Font Size (ems)',
                                    type: 'number',
                                    units: 'em',
                                    value: 1,
                                    min: 1,
                                    max: 10
                                },
                                color: {
                                    __name: 'Font color',
                                    type: 'text',
                                    value: 'black'
                                },
                                opacity: {
                                    __name: 'Opacity',
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.1
                                },
                                padding: {
                                    __name: 'Padding (px)',
                                    type: 'number',
                                    units: 'px',
                                    value: 15,
                                    min: 0
                                }
                            }
                        },
                        extra: {
                            __name: "Extra",
                            buttons: {}
                        }
                    }
                }
            }
        }
    }
}
