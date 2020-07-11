import SpoilerFilter from "../State/SpoilerFilter";
import { Component } from "react";
import React from "react";
import { Form, Image } from "semantic-ui-react";
import { SoloClassShorthand } from "../State/Types";

type Props = {
    spoilerFilter: SpoilerFilter,
    storeProsperity: (prosperity: number) => {},
    storeEnableStoreStockManagement: (enableStoreStockManagement: boolean) => {},
    storeItem: (item: Array<number>) => {},
    storeSoloClass: (soloClass: Array<SoloClassShorthand>) => {}
}

const GloomhavenSoloClassShorthands: Array<SoloClassShorthand> = ['BR', 'TI', 'SW', 'SC', 'CH', 'MT', 'SK', 'QM', 'SU', 'NS', 'PH', 'BE', 'SS', 'DS', 'SB', 'EL', 'BT'];

class SpoilerFilters extends Component<Props> {


    toggleItemFilter(key: number) {
        const {item} = this.props.spoilerFilter;
        if (item.includes(key)) {
            item.splice(item.indexOf(key), 1);
        } else {
            item.push(key)
        }
        this.props.storeItem(item);
    }

    toggleClassFilter(key: SoloClassShorthand) {
        const {soloClass} = this.props.spoilerFilter;
        if (soloClass.includes(key)) {
            soloClass.splice(soloClass.indexOf(key), 1);
        } else {
            soloClass.push(key)
        }
        this.props.storeSoloClass(soloClass);
    }

    render() {

        const spoilerFilter = this.props.spoilerFilter;
        const {enableStoreStockManagement, all} = spoilerFilter;

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
                            checked={enableStoreStockManagement}
                            onClick={() => {
                                this.props.storeEnableStoreStockManagement(!spoilerFilter.enableStoreStockManagement);
                            }}/>
                    </Form.Group>

                    <Form.Group inline>
                        <label>Prosperity:</label>
                        {[...Array(9).keys()].map(index => {
                            const prosperity = index + 1;
                            return (
                                <Form.Radio key={index} label={prosperity}
                                            checked={spoilerFilter.prosperity === prosperity}
                                            onChange={() => this.props.storeProsperity(prosperity)}/>
                            )})}
                    </Form.Group>

                    {spoilerFilter.prosperity < 9 && <Form.Group inline className={'inline-break'}>
                        <label>Prosperity Items:</label>
                        {/* 15-70 prosperity 2-9*/}
                        {[...Array(70 - (spoilerFilter.prosperity + 1) * 7).keys()].map((val) => {
                            const id = val + 1 + (spoilerFilter.prosperity + 1) * 7;
                            return (
                                <Form.Checkbox key={val} label={'#' + (id + '').padStart(3, '0')}
                                            checked={spoilerFilter.item.includes(id)}
                                            onChange={() => this.toggleItemFilter(id)}/>
                            )
                        })}
                    </Form.Group>}

                    <Form.Group inline className={'inline-break'}>
                        <label>Random Item Design:</label>
                        {/* 71-95 random item design*/}
                        {[...Array(25).keys()].map((val) => {
                            const id = val + 71;
                            return (
                                <Form.Checkbox key={val} label={'#' + (id + '').padStart(3, '0')}
                                            checked={spoilerFilter.item.includes(id)}
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
                                            checked={spoilerFilter.item.includes(id)}
                                            onChange={() => this.toggleItemFilter(id)}/>
                            )
                        })}
                    </Form.Group>

                    <Form.Group inline className={'inline-break'}>
                        <label>Solo Class Items:</label>
                        {GloomhavenSoloClassShorthands.map(key => (
                            <Image key={key} src={require(`../img/classes/${key}.png`)}
                                className={'icon' + (spoilerFilter.soloClass.includes(key) ? '' : ' disabled')}
                                onClick={() => this.toggleClassFilter(key)}/>
                        ))}
                    </Form.Group>

                </Form>
            </React.Fragment>
        );
    }
}

export default SpoilerFilters