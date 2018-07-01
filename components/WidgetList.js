import React, {Component} from 'react';
import {View, Alert, ScrollView} from 'react-native';
import {Text, ListItem} from 'react-native-elements';
import {Button} from 'react-native-elements';
import AssignmentList from "./AssignmentList";
import AssignmentWidgetServiceClient from '../servicesClient/AssignmentWidgetServiceClient';
import AssignmentWidget from "../elements/AssignmentWidget";


class WidgetList extends Component {
    static navigationOptions = {title: 'WidgetList'}
    constructor(props) {
        super(props)
        this.state = {
            widgets: [],
            topicId: 1,
        }
        this.AssignmentWidgetServiceClient = AssignmentWidgetServiceClient.instance;

    }

    componentDidMount() {
        const {navigation} = this.props;
        const topicId = navigation.getParam("topicId")
        this.setState({topicId});

    }

    createAssignment(topicId, assignment){
        this.AssignmentWidgetServiceClient
            .createAssignment(topicId, assignment)
    }

    render() {
        return(
            <ScrollView style={{padding: 15}}>
                <AssignmentList topicId={this.props.navigation.getParam("topicId")}
                                navigation={this.props.navigation}/>

                <Button title="Create Widget"
                        onPress={() => this.props.navigation
                            .navigate('WidgetList')}/>

            </ScrollView>
        )
    }
}
export default WidgetList