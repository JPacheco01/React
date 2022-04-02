import React, { Component } from "react";
import { Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Label, } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, Errors, LocalForm } from "react-redux-form";
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Random } from 'react-animation-components';


const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);





function RenderCampsite( {campsite: { image, name, description } }){
    
    return(
        <div className="col-md-5 m-1">
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(100%)'
            }}>
                <Card>
                    <CardImg top src={baseUrl + image} alt={name} />
                    <CardBody>
                        <CardText>{ description }</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        </div>
    );
}

function RenderComments({comments, postComment, campsiteId}){
    const dateFormat = { year: 'numeric', month: 'short', day: '2-digit' };
    if(comments){
        return(
            <div className="col-md-5 m-1">
                <h4>Comments</h4>
                <Random in>
                    {comments.map(( { id, text, author, date }) => {return(
                        <Fade in key={id}>
                            <p>
                                {text}
                                <br/>
                                -- {author}, {new Date(date).toLocaleDateString('en-US', dateFormat)}
                            </p>
                        </Fade>
                        )
                    })}
                </Random>
                <CommentForm campsiteId={campsiteId} postComment={postComment} />
            </div>
        );
    }
    return <div />;
}

 
function CampsiteInfo(props) {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }
    if(props.campsite){
        return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <h2>{props.campsite.name}</h2>
                    <hr />
                </div>
            </div>
            <div className="row">
                <RenderCampsite campsite={props.campsite} />
                <RenderComments 
                    comments={props.comments}
                    postComment={props.postComment}
                    campsiteId={props.campsite.id}
                />
            </div>
        </div>
        );
    }
    else{
        return (<div/>);
    }
}

class CommentForm extends Component{
    constructor(props){
        super(props);

        this.state = {
            isModalOpen: false
        };

        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values){
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
    }

    render(){
        return (
            <>
                <Button className="fa fa-pencil fa-lg" outline onClick={this.toggleModal}>Submit Comment</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={values => this.handleSubmit(values)}>
                            <div className="form-group">
                                <Label htmlFor="rating">Rating</Label>
                                <Control.select defaultValue="1" className="form-control" model=".rating" id="rating" name="rating">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </Control.select>
                            </div>
                            <div className="form-group">
                                <Label htmlFor="author">Your Name</Label>
                                <Control.text className="form-control" model=".author" id="author" name="author" validators={{
                                    required,
                                    minLength: minLength(2), 
                                    maxLength: maxLength(15)
                                }} />
                                <Errors 
                                    className="text-danger" 
                                    model=".author"
                                    show="touched" component="div"
                                    messages={{
                                        required: 'Required',
                                        minLength: 'Must be atleast 2 characters',
                                        maxLength: 'Must be 15 characters or less'
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="text">Comment</Label>
                                <Control.textarea className="form-control" model=".text" id="text" name="text" rows="6"/>
                            </div>
                            
                            <Button type="submit" color="primary">
                                Submit
                            </Button>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </>
        );
    }
}


export default CampsiteInfo;