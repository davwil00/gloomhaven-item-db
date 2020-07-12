import ConfigurationState from "../../State/ConfigurationState";
import { Component } from "react";
import React from "react";
import { Form, Image } from "semantic-ui-react";
import { SoloClassShorthand } from "../../State/Types";

type Props = {
    configurationState: ConfigurationState,
    discount: number,
    storeProsperity: (prosperity: number) => {},
    storeEnableStoreStockManagement: (enableStoreStockManagement: boolean) => {},
    storeProsperityItem: (item: Array<number>) => {},
    storeSoloClass: (soloClass: Array<SoloClassShorthand>) => {},
    storeDiscount: (discount: number) => {}
}

const GloomhavenSoloClassShorthands: Array<SoloClassShorthand> = ['BR', 'TI', 'SW', 'SC', 'CH', 'MT', 'SK', 'QM', 'SU', 'NS', 'PH', 'BE', 'SS', 'DS', 'SB', 'EL', 'BT'];

class Configuration extends Component<Props> {

    toggleItemFilter(key: number) {
        const {prosperityItemIds} = this.props.configurationState;
        if (prosperityItemIds.includes(key)) {
            prosperityItemIds.splice(prosperityItemIds.indexOf(key), 1);
        } else {
            prosperityItemIds.push(key)
        }
        this.props.storeProsperityItem(prosperityItemIds);
    }

    toggleClassFilter(key: SoloClassShorthand) {
        const {soloClass} = this.props.configurationState;
        if (soloClass.includes(key)) {
            soloClass.splice(soloClass.indexOf(key), 1);
        } else {
            soloClass.push(key)
        }
        this.props.storeSoloClass(soloClass);
    }

    render() {

        const {configurationState, discount} = this.props;

        return (
            <React.Fragment>

                <Form>

                    {/* <Form.Group inline>
                        <label>Respecting Spoiler Settings:</label>
                        <Button
                            color={all ? 'red' : 'blue'}
                            onClick={() => this.toggleShowAll()}
                        >
                            {all
                                ? <React.Fragment><Icon name={'eye'}/> disabled</React.Fragment>
                                : <React.Fragment><Icon name={'eye slash'}/> enabled</React.Fragment>
                            }
                        </Button>
                    </Form.Group> */}

                    <Form.Group inline>
                        <label>Enable Store Stock Management:</label>
                        <Form.Checkbox
                            toggle
                            checked={configurationState.enableStoreStockManagement}
                            onClick={() => {
                                this.props.storeEnableStoreStockManagement(!configurationState.enableStoreStockManagement);
                            }}/>
                    </Form.Group>

                    <Form.Group inline>
                        <label>Prosperity:</label>
                        {[...Array(9).keys()].map(index => {
                            const prosperity = index + 1;
                            return (
                                <Form.Radio key={index} label={prosperity}
                                            checked={configurationState.prosperity === prosperity}
                                            onChange={() => this.props.storeProsperity(prosperity)}/>
                            )})}
                    </Form.Group>

                    {configurationState.prosperity < 9 && <Form.Group inline className={'inline-break'}>
                        <label>Prosperity Items:</label>
                        {/* 15-70 prosperity 2-9*/}
                        {[...Array(70 - (configurationState.prosperity + 1) * 7).keys()].map((val) => {
                            const id = val + 1 + (configurationState.prosperity + 1) * 7;
                            return (
                                <Form.Checkbox key={val} label={'#' + (id + '').padStart(3, '0')}
                                            checked={configurationState.prosperityItemIds.includes(id)}
                                            onChange={() => this.toggleItemFilter(id)}/>
                            )
                        })}
                    </Form.Group>}

                    {<Form.Group inline className="inline-break">
                        <label>Reputation Discount:</label>
                        <Form.Select value={discount}
                                options={[
                                    {value: -5, text: "-5 gold"}, // (19 - 20)
                                    {value: -4, text: "-4 gold"}, // (15 - 18)
                                    {value: -3, text: "-3 gold"}, // (11 - 14)
                                    {value: -2, text: "-2 gold"}, // (7 - 13)
                                    {value: -1, text: "-1 gold"}, // (3 - 6)
                                    {value: 0, text: "none"}, // (-2 - 2)
                                    {value: 1, text: "+1 gold"}, // (-3 - -6)
                                    {value: 2, text: "+2 gold"}, // (-7 - -10)
                                    {value: 3, text: "+3 gold"}, // (-11 - -14)
                                    {value: 4, text: "+4 gold"}, // (-15 - -18)
                                    {value: 5, text: "+5 gold"}, // (-19 - -20)
                                ]}
                                onChange={(obj, e) => {
                                    this.props.storeDiscount(typeof e.value === 'number' ? e.value : 0);
                                }}
                        />
                    </Form.Group>}

                    <Form.Group inline className={'inline-break'}>
                        <label>Random Item Design:</label>
                        {/* 71-95 random item design*/}
                        {[...Array(25).keys()].map((val) => {
                            const id = val + 71;
                            return (
                                <Form.Checkbox key={val} label={'#' + (id + '').padStart(3, '0')}
                                            checked={configurationState.prosperityItemIds.includes(id)}
                                            onChange={() => this.toggleItemFilter(id)}/>
                            )
                        })}
                    </Form.Group>


                    <Form.Group inline className={'inline-break'}>
                        <label>Other Items:</label>
                        {/* 96-133 other items*/}
                        {[...Array(38).keys()].map((val) => {
                            const id = val + 96;
                            return (
                                <Form.Checkbox key={val} label={'#' + (id + '').padStart(3, '0')}
                                            checked={configurationState.prosperityItemIds.includes(id)}
                                            onChange={() => this.toggleItemFilter(id)}/>
                            )
                        })}
                    </Form.Group>

                    <Form.Group inline className={'inline-break'}>
                        <label>Solo Class Items:</label>
                        {GloomhavenSoloClassShorthands.map(key => (
                            <Image key={key} src={require(`../../img/classes/${key}.png`)}
                                className={'icon' + (configurationState.soloClass.includes(key) ? '' : ' disabled')}
                                onClick={() => this.toggleClassFilter(key)}/>
                        ))}
                    </Form.Group>

                </Form>
            </React.Fragment>
        );
    }
}

export default Configuration