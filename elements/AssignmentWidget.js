import React from 'react';
import AssignmentWidgetServiceClient from '../services-client/AssignmentWidgetServiceClient ';
import {ScrollView, TextInput, Text, StyleSheet, View} from 'react-native';
import {FormLabel, FormInput, FormValidationMessage, Button, ListItem} from 'react-native-elements';

export default class AssignmentWidget extends React.Component {
    static navigationOptions = {title: 'AssignmentWidget'};

    constructor(props) {
        super(props);
        this.state = {
            assignmentId: "",
            points: '0',
            description: '',
            preview: false,
            assignmentName: "New Assignment"
        }
        this.AssignmentWidgetServiceClient = AssignmentWidgetServiceClient.instance;
        this.findAssignmentById = this.findAssignmentById.bind(this);
        this.viewMode = this.viewMode.bind(this);
    }

    componentDidMount() {
        // const {navigation} = this.props;
        // //const topicId = navigation.getParam("topicId")
        // const topicId = "32"
        // this.findAssignmentById(this.state.assignmentId);
        // fetch("http://localhost:8080/api/topic/" + topicId + "/widget")
        //     .then(response => (response.json()))
        //     .then(widgets => this.setState({widgets}))
    }

    findAssignmentById(id) {
        this.AssignmentWidgetServiceClient
            .findAssignmentById(id);

    }


    viewMode(isPreview) {
        if (isPreview) {
            return (
                <View>
                    <Text>Preview</Text>
                    <Text>{this.state.assignmentName}</Text>
                    <Text>{this.state.points}</Text>
                    <Text>{this.state.description}</Text>
                    <FormLabel>Essay answer</FormLabel>
                    <FormInput></FormInput>


                    <Text>Upload a File</Text>
                    <Button title="Choose File"/>
                    <Text>No file chosen</Text>

                    <FormLabel>Submit a link</FormLabel>
                    <FormInput></FormInput>

                    <Button title="Cancel"/>
                    <Button title="Submit"/>


                    



                </View>
            );
        } else {
            return (
                <View>
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
                </View>
            );
        }
    }

    render() {
        return (
            <ScrollView>
                <Button title="Preview"
                        onPress={() => this.setState({preview: !this.state.preview})}/>
                {this.viewMode(this.state.preview)}
            </ScrollView>
        )
    }


}