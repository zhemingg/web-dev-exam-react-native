import React from 'react';
import {ScrollView, Text, View, TextInput} from 'react-native';
import {FormLabel, FormInput, Button} from 'react-native-elements';
import EssayQuestionServiceClient from "../servicesClient/EssayQuestionServiceClient";

export default class EssayQuestionEditor extends React.Component{
    static navigationOptions = {title: 'EssayQuestionEditor'};
    constructor(props){
        super(props);
        this.state = {
            question: {
                id: '',
                title: '',
                points: '',
                description: '',
                questionType: 'essayQuestion'
            },
            preview: false,
            type: '',
            examId: '',
        }
        this.viewMode = this.viewMode.bind(this);
        this.EssayQuestionServiceClient = EssayQuestionServiceClient.instance;
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
        return this.EssayQuestionServiceClient
            .createEssayQuestion(this.state.examId, question);

    }

    updateQuestion(question) {
        return this.EssayQuestionServiceClient
            .updateEssayQuestion(question.id, question);
    }

    deleteQuestion() {
        if (this.state.question.id !== '') {
            let ref = this.props.navigation.getParam('findAll');
            return this.EssayQuestionServiceClient
                .deleteEssayQuestion(this.state.question.id).then(() => ref(this.state.examId));
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
                    <TextInput
                        style={{height: 100, borderRadius: 5}}
                        backgroundColor="white"
                        multiline={true}
                        numberOfLines={4}
                    />
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
    render(){
        return(
            <ScrollView>
                <Button title="Preview"
                        onPress={() => this.setState({preview: !this.state.preview})}/>
                {this.viewMode(this.state.preview)}
            </ScrollView>
        )
    }
}