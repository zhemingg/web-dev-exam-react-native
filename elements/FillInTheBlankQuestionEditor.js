import React from 'react';
import {ScrollView, Text, View, TextInput, Alert} from  'react-native';
import {Button, FormLabel, FormInput, ListItem, Icon} from 'react-native-elements';
import FillInTheBlankQuestionServiceClient from "../servicesClient/FillInTheBlankQuestionServiceClient";

export default class FillInTheBlankQuestionEditor extends React.Component{
    static navigationOptions = {title: 'FillInTheBlankQuestionEditor'};
    constructor(props){
        super(props);
        this.state = {
            question: {
                id: '',
                title: '',
                points: '',
                description: '',
                questionType: 'fillInTheBlankQuestion',
                items:[]
            },
            preview: false,
            type: '',
            examId: '',
            newItem:''
        }
        this.FillInTheBlankQuestionServiceClient = FillInTheBlankQuestionServiceClient.instance;
        this.renderItems = this.renderItems.bind(this);
        this.viewMode = this.viewMode.bind(this);
        this.createQuestion = this.createQuestion.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
        this.saveOrUpdate = this.saveOrUpdate.bind(this);
        this.addNewTest = this.addNewTest.bind(this);
        this.checkValidForItem = this.checkValidForItem.bind(this);
        this.renderItemsView = this.renderItemsView.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;
        const examId = navigation.getParam("examId");
        const type = navigation.getParam("type");
        const question = navigation.getParam("question");
        this.setState({type});
        this.setState({examId})
        if (type === 'update') {
            this.setState({question})
        }
    }

    saveOrUpdate(type) {
        var ref = this.props.navigation.getParam('findAll');
        if (type === 'create') {
            return this.createQuestion(this.state.question).then(() => ref(this.state.examId))
        } else {
            return this.updateQuestion(this.state.question).then(() => ref(this.state.examId))
        }

    }

    createQuestion(question) {
        return this.FillInTheBlankQuestionServiceClient
            .createFillInTheBlankQuestion(this.state.examId, question);

    }

    updateQuestion(question) {
        return this.FillInTheBlankQuestionServiceClient
            .updateFillInTheBlankQuestion(question.id, question);
    }

    deleteQuestion() {
        if (this.state.question.id !== '') {
            let ref = this.props.navigation.getParam('findAll');
            return this.FillInTheBlankQuestionServiceClient
                .deleteFillInTheBlankQuestion(this.state.question.id).then(() => ref(this.state.examId));
        }
    }

    addNewTest(){
        if (this.checkValidForItem(this.state.newItem)){
            let question = this.state.question;
            question.items.push(this.state.newItem);
            this.setState({question});
        }
    }

    checkValidForItem(str){
        if (str === ''){
            Alert.alert('The test can not be empty');
            return false;
        } else if (str.indexOf('[') === '-1' || str.indexOf(']') === '-1'){
            console.log(str.indexOf('['));
            Alert.alert('The input is not valid, please check again');
            return false;
        } else {
            return true;
        }
    }


    viewMode(isPreview){
        if(isPreview) {
            return (
                <View>
                    <Text>Preview</Text>
                    <Text>{this.state.question.title}</Text>
                    <Text>{this.state.question.points}</Text>
                    <Text>{this.state.question.description}</Text>
                    {this.renderItemsView()}
                </View>
            )
        } else {
            return (
                <View>
                    <FormLabel>Question Title</FormLabel>
                    <FormInput onChangeText={(text) => {
                        let question = this.state.question;
                        question.title = text;
                        this.setState({question: question})
                    }}
                               placeholder={'Please add title'}
                               value={this.state.question.title}/>

                    <FormLabel>Question Points</FormLabel>
                    <FormInput onChangeText={(text) => {
                        let question = this.state.question;
                        question.points = text;
                        this.setState({question: question})
                    }}
                               placeholder={'Please set points'}
                               value={this.state.question.points}/>

                    <FormLabel>Question Description</FormLabel>
                    <TextInput
                        multiline={true}
                        numberOfLines={10}
                        onChangeText={(text) => {
                            let question = this.state.question;
                            question.description = text;
                            this.setState({question: question})
                        }}
                        placeholder={'Please add description'}
                        value={this.state.question.description}/>

                    <FormLabel>New Test</FormLabel>
                    <FormInput onChangeText={(text) => {
                        this.setState({newItem: text})
                    }}
                               placeholder={'Please add new test'}
                               value={this.state.newItem}/>
                    {this.renderItems()}
                    {this.renderItemsView()}
                    <Button title="Add New Test"
                            onPress={() => (this.addNewTest())}/>
                    <Button title="Cancel Modify"
                            onPress={() => (this.props.navigation.goBack())}/>
                    <Button title="Delete Question"
                            onPress={() => {
                                (this.deleteQuestion())
                                this.props.navigation.goBack()
                            }}/>
                    <Button title="Submit"
                            onPress={() => {
                                this.saveOrUpdate(this.props.navigation.getParam('type'))
                                this.props.navigation.goBack()
                            }}/>
                </View>
            )
        }
    }

    renderItems(){
        return this.state.question.items.map(
            (item, index) => {
                return(
                    <ListItem
                        title={item}
                        key={index}
                    />
                )
            }
        )
    }

    renderItemsView(){
        return (
            this.state.question.items.map(
                (item, index) => {
                    let index1 = item.indexOf('['), index2 = item.indexOf(']');
                    let part1 = item.substring(0, index1), part2 = item.substring(index2+1);

                    return(
                        <View
                            style={{ flexDirection : 'row', marginTop: 10}}
                            key={index}>
                            <Text>{part1}</Text>
                            <TextInput
                                style={{borderRadius: 5, width: 100}}
                                backgroundColor="white"
                                multiline={true}/>
                            <Text>{part2}</Text>
                            <Icon
                                name='delete'
                                size={30}
                                onPress={
                                    () => {
                                        let question = this.state.question;
                                        question.items.splice(index,1);
                                        this.setState(question);
                                    }
                                }
                                color='red'
                            />
                        </View>
                    )
                }


            )
        )
    }

    render(){
        return (
            <ScrollView>
                <Button title="Preview"
                        onPress={() => this.setState({preview: !this.state.preview})}/>
                {this.viewMode(this.state.preview)}
            </ScrollView>
        )
    }
}