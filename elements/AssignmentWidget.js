import React from 'react';
import AssignmentWidgetServiceClient from '../servicesClient/AssignmentWidgetServiceClient';
import {ScrollView, TextInput, View} from 'react-native';
import {FormLabel, FormInput, FormValidationMessage, Button, Text} from 'react-native-elements';

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
    }

    componentDidMount() {
        const {navigation} = this.props;
        const topicId = navigation.getParam("topicId");
        const type = navigation.getParam("type");
        this.setState({topicId});
        this.setState({type});
        if (type === 'update') {
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
                <View style={{padding:15}}>
                    <Text h2>Preview</Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text h4>{this.state.assignment.title}</Text>
                        <Text h4>{this.state.assignment.points} pts</Text>
                    </View>
                    <Text h5 style={{marginTop: 15}}>Description:{this.state.assignment.description}</Text>
                    <Text h4 style={{marginTop: 15}}>Essay answer</Text>
                    <TextInput
                        style={{height: 100, borderRadius: 10}}
                        backgroundColor="white"
                        multiline={true}
                        numberOfLines={5}
                    />

                    <Text h4 style={{marginTop: 15}}>Upload a File</Text>
                    <View backgroundColor="white"
                          style={{
                              flexDirection: 'row', borderRadius: 10
                          }}>
                        <Button title="Choose File" buttonStyle={{backgroundColor: 'blue', borderRadius: 10}}/>
                        <Text h4>No file chosen</Text>
                    </View>

                    <Text h4 style={{marginTop: 15}}>Submit a link</Text>
                    <TextInput
                        style={{borderRadius: 5, height: 30}}
                        backgroundColor="white"
                        multiline={true}
                        numberOfLines={1}
                    />
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Button title="Cancel"  buttonStyle={{backgroundColor: 'red', borderRadius: 10, marginTop: 10}}/>
                        <Button title="Submit"  buttonStyle={{backgroundColor: 'blue', borderRadius: 10, marginTop: 10}}/>
                    </View>
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
                               placeholder={'Please add title'}
                               backgroundColor="white"
                               multiline={true}
                               value={this.state.assignment.title}/>
                    <FormValidationMessage>Title is required</FormValidationMessage>

                    <FormLabel>Assignment Points</FormLabel>
                    <FormInput onChangeText={(text) => {
                        let assignment = this.state.assignment;
                        assignment.points = text;
                        this.setState({assignment: assignment})
                    }}
                               placeholder={'Please set points'}
                               backgroundColor="white"
                               multiline={true}
                               value={this.state.assignment.points}/>
                    <FormValidationMessage>Points are required</FormValidationMessage>

                    <FormLabel>Assignment Description</FormLabel>
                    <FormInput
                        backgroundColor="white"
                        multiline={true}
                        onChangeText={(text) => {
                            let assignment = this.state.assignment;
                            assignment.description = text;
                            this.setState({assignment: assignment})
                        }}
                        placeholder={'Please add description'}
                        value={this.state.assignment.description}/>
                    <FormValidationMessage>Description is required</FormValidationMessage>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Button title="Create or Update"
                                buttonStyle={{backgroundColor: 'blue', borderRadius: 10, marginTop: 10}}
                                onPress={() => {
                                    this.saveOrUpdate(this.state.type)
                                        .then(this.props.navigation.goBack())
                                }
                                }/>
                        <Button title="Cancel Modify"
                                buttonStyle={{backgroundColor: 'red', borderRadius: 10, marginTop: 10}}
                                onPress={() => {
                                    this.props.navigation.goBack()
                                }
                                }/>
                    </View>
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
            <ScrollView style={{margin: 15}}>
                <Button title="Preview"
                        buttonStyle={{backgroundColor: 'blue', borderRadius: 10, marginTop: 10}}
                        onPress={() => this.setState({preview: !this.state.preview})}/>
                {this.viewMode(this.state.preview)}
            </ScrollView>
        )
    }


}