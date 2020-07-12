import React, { Component } from "react"
import { ItemsInUse, GloomhavenItem } from "../../State/Types"
import { Form, Select, Input } from "semantic-ui-react"

type Props = {
    itemsInUse: ItemsInUse,
    items: Array<GloomhavenItem>
    storeItems: (items: ItemsInUse) => {}
}

class Shop extends Component<Props> {
    playerNames = ["David", "Katie", "Paul", "Tim"].map(name => {return {key: name, value: name, text: name}})

    render() {
        const {items} = this.props
        return (
            <Form>
                <Select fluid label="Player"
                        placeholder='Select player' 
                        options={this.playerNames} />
                <Input fluid label="Item Name" list="items"/>
                <datalist id="items">
                    {items.map(item => <option key={item.id} value={item.name}/>)}
                </datalist>
            </Form>
        )
    }
}

export default Shop