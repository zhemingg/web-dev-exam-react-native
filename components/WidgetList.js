import React, {Component} from 'react';
import {View, Alert, ScrollView} from 'react-native';
import {Text, ListItem} from 'react-native-elements';
import {Button} from 'react-native-elements';

class WidgetList extends Component {
    static navigationOptions = {title: 'Widgets'}
    constructor(props) {
        super(props)
        this.state = {
            widgets: [],
            topicId: 1
        }
    }
    componentDidMount() {
        const {navigation} = this.props;
        //const topicId = navigation.getParam("topicId")
        const topicId = "32"
        fetch("http://localhost:8080/api/topic/"+topicId+"/widget")
            .then(response => (response.json()))
            .then(widgets => this.setState({widgets}))
    }
    render() {
        return(
            <ScrollView style={{padding: 15}}>
                {this.state.widgets.map(
                    (widget, index) => (
                        <ListItem
                            onPress={() => this.props.navigation
                                .navigate("QuestionList", {examId: widget.id})}
                            key={index}
                            // subtitle={widget.description}
                            title={widget.name}/>))}
                <Button title="Create Assignment"
                        onPress={() => this.props.navigation
                            .navigate('WidgetList')}/>
                <Button title="Create Widget"
                        onPress={() => this.props.navigation
                            .navigate('WidgetList')}/>

            </ScrollView>
        )
    }
}
export default WidgetList