import React from 'react';
import AssignmentWidgetServiceClient from '../servicesClient/AssignmentWidgetServiceClient';
import {ScrollView, TextInput, Text, StyleSheet, View} from 'react-native';
import {FormLabel, FormInput, FormValidationMessage, Button, ListItem} from 'react-native-elements';

export default class AssignmentWidget extends React.Component {
    static navigationOptions = {title: 'AssignmentWidget'};

    constructor(props) {
        super(props);
        //console.log(this.props);
        this.state = {
            topicId: "",
            preview: false,
            type: "",
            assignment: {
                id: "",
                points: '',
                description: '',
                title: "",
                widgetType: 'assignment'
            }
        }
        this.AssignmentWidgetServiceClient = AssignmentWidgetServiceClient.instance;
        this.viewMode = this.viewMode.bind(this);
        this.saveAssignment = this.saveAssignment.bind(this);
        this.updateAssignment = this.updateAssignment.bind(this);
        this.saveOrUpdate = this.saveOrUpdate.bind(this);
        // this.findAllAssignmentForTopic = this.findAllAssignmentForTopic.bind(this);
    }

    componentDidMount() {
        // this.setState({assignmentId: this.props.navigation.getParam("assignment").assignmentId})
        const {navigation} = this.props;
        const topicId = navigation.getParam("topicId");
        const type = navigation.getParam("type");
        this.setState({topicId});
        this.setState({type});
        if (type === 'update'){
            let tempAssignment = navigation.getParam('assignment');
            let assignment = {
                id: tempAssignment.id,
                points: tempAssignment.points,
                description: tempAssignment.description,
                title: tempAssignment.title,
                widgetType: 'assignment'
            }
            this.setState({assignment});
        }

    }


    viewMode(isPreview) {
        if (isPreview) {
            return (
                <View>
                    <Text>Preview</Text>
                    <Text>{this.state.assignment.title}</Text>
                    <Text>{this.state.assignment.points}</Text>
                    <Text>{this.state.assignment.description}</Text>
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
                    <FormLabel>Assignment Title</FormLabel>
                    <FormInput onChangeText={(text) => {
                        let assignment = this.state.assignment;
                        assignment.title = text;
                        this.setState({assignment: assignment})
                    }}
                               placeholder = {'Please add title'}
                               value={this.state.assignment.title}/>

                    <FormLabel>Assignment Points</FormLabel>
                    <FormInput onChangeText={(text) => {
                        let assignment = this.state.assignment;
                        assignment.points = text;
                        this.setState({assignment: assignment})
                    }}
                               placeholder = {'Please set points'}
                               value={this.state.assignment.points}/>

                    <FormLabel>Assignment Description</FormLabel>
                    <TextInput
                        multiline={true}
                        numberOfLines={10}
                        onChangeText={(text) => {
                            let assignment = this.state.assignment;
                            assignment.description = text;
                            this.setState({assignment: assignment})
                        }}
                        placeholder = {'Please add description'}
                        value={this.state.assignment.description}/>
                    <Button title="Save"
                            onPress={() => {
                                //console.log(this.state);
                                this.saveOrUpdate(this.state.type)
                                // .then(this.props.navigation.getParam('findAll')(this.state.topicId))
                                .then(this.props.navigation.goBack())}
                            }/>
                </View>
            );
        }
    }

    saveOrUpdate(type) {
        let ref = this.props.navigation.getParam('findAll');
        if (type === 'create') {
            return this.saveAssignment(this.state.assignment).then(() => ref())

        } else {
            return this.updateAssignment(this.state.assignment).then(() => ref())

        }

    }

    saveAssignment(assignment) {
        return this.AssignmentWidgetServiceClient
            .createAssignment(this.state.topicId, assignment);
    }

    updateAssignment(assignment) {
        return this.AssignmentWidgetServiceClient
            .updateAssignment(assignment.id, assignment);

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