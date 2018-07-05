import React from 'react';
import AssignmentWidgetServiceClient from '../servicesClient/AssignmentWidgetServiceClient';
import {ScrollView} from 'react-native';
import {ListItem, Button, Icon, Text} from 'react-native-elements';

export default class AssignmentList extends React.Component {
    // static navigationOptions = {title: 'AssignmentList'}
    constructor(props){
        super(props);
        this.state = {
            assignments:[],
            topicId: 1
        }
        this.AssignmentWidgetServiceClient = AssignmentWidgetServiceClient.instance;
        this.findAllAssignmentForTopic = this.findAllAssignmentForTopic.bind(this);
        this.deleteAssignment = this.deleteAssignment.bind(this);
    }


    componentDidMount() {
        this.setState({topicId: this.props.topicId});
        this.findAllAssignmentForTopic(this.props.topicId);
    }

    findAllAssignmentForTopic(){
        return this.AssignmentWidgetServiceClient
            .findAllAssignmentForTopic(this.props.topicId)
            .then(assignments => {
                this.setState({assignments})
            })
    }

    deleteAssignment(id){
        return this.AssignmentWidgetServiceClient
            .deleteAssignment(id).then(() => this.findAllAssignmentForTopic())
    }

    render() {
        return(
            <ScrollView style={{padding: 15}}>
                <Text h2>Assignments</Text>
                {this.state.assignments.map(
                    (assignment, index) => (
                        <ListItem
                            onPress={() => {
                                this.props.navigation.navigate('AssignmentWidget',
                                    {topicId: this.state.topicId, type: 'update',
                                        findAll:this.findAllAssignmentForTopic,
                                        assignment: assignment,
                                        id:assignment.id}
                                )}}
                            key={index}
                            rightIcon = {<Icon name={'delete'} size={30} color='red'
                            onPress={() => this.deleteAssignment(assignment.id)}/>}
                            title={assignment.title}/>))}
                <Button title="Create Assignment"
                        onPress={() => {
                            this.props.navigation.navigate('AssignmentWidget',
                                {topicId: this.state.topicId, type: 'create', findAll:this.findAllAssignmentForTopic}
                            )
                        }}
                        buttonStyle={{backgroundColor: 'blue', borderRadius: 10, marginTop: 10}}
                />

            </ScrollView>
        )
    }
}
