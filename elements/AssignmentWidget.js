import React from 'react';
import AssignmentWidgetServiceClient from '../services-client/AssignmentWidgetServiceClient ';
import {ScrollView, TextInput, Text, StyleSheet} from 'react-native';
import {FormLabel, FormInput, FormValidationMessage, Button} from 'react-native-elements';

export default class AssignmentWidget extends React.Component {
    static navigationOptions = {title: 'AssignmentWidget'};

    constructor(props) {
        super(props);
        this.state = {
            assignmentId: "",
            points: '',
            description: ''
        }
        this.AssignmentWidgetServiceClient = AssignmentWidgetServiceClient.instance;
        this.findAssignmentById = this.findAssignmentById.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;
        //const topicId = navigation.getParam("topicId")
        const topicId = "32"
        this.findAssignmentById(this.state.assignmentId);
        fetch("http://localhost:8080/api/topic/" + topicId + "/widget")
            .then(response => (response.json()))
            .then(widgets => this.setState({widgets}))
    }

    findAssignmentById(id) {
        this.AssignmentWidgetServiceClient
            .findAssignmentById(id);

    }

    render() {
        return (
            <ScrollView >
                <FormLabel>Assignment Name</FormLabel>
                <FormInput></FormInput>

                <FormLabel>Assignment Points</FormLabel>
                <FormInput></FormInput>

                <FormLabel>Assignment Description</FormLabel>
                <TextInput
                    multiline={true}
                    numberOfLines={10}
                    onChangeText={(description) => this.setState({description})}
                    value={this.state.description}/>
                <Button title="Save"/>

            </ScrollView>
        )
    }



}