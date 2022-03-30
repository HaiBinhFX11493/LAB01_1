import React,{Component,useState} from "react";
import { Card, CardImg, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem,ModalHeader,
	Button,Modal,ModalBody,
	Form,FormGroup,Input,Label,Row, Col } from 'reactstrap';
	import { Control, LocalForm, Errors } from 'react-redux-form';
	import { Loading } from './LoadingComponent';
import { Link } from 'react-router-dom';
import { baseUrl } from '../shared/baseUrl';

import { addComment, fetchDishes, fetchComments, fetchPromos } from '../redux/ActionCreators';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);
const isNumber = (val) => !isNaN(Number(val));
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);

   function RenderDish({dish}) {
        return(
            <div >
                <Card>
				<CardImg top src={baseUrl + dish.image} alt={dish.name} />
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            </div>
        );
    }

   function RenderComments({comments,addComment, dishId}) {
	  

	
        if(comments != null){
            return(
                <div className="col-12 col-md-5 m-1">
                    <h4>Comments</h4>
                    <ul className="list-unstyled">
                        {comments.map((comment) => {
                            return(
                                <li key={comment.id}>
                                    <p>{comment.comment}</p>
                                    <p>-- { comment.author }, { new Intl.DateTimeFormat('en-US', {year:'numeric', month:'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                                </li>
                            );
                        })}
                    </ul>
				<CommentForm dishId={dishId} addComment={addComment}/>
                </div>
            );
        } else {
            return(
                <div></div>
            );
        }
    }

	class CommentForm extends Component{
		
		constructor(props) {
			super(props);
	
			this.state={
				isNavOpen: false,
				isModalOpen: false
			};
			this.toggleNav=this.toggleNav.bind(this);
			this.toggleModal=this.toggleModal.bind(this);
		}
		
		toggleNav() {
			this.setState({
				isNavOpen: !this.state.isNavOpen
			});
		}
	
		toggleModal() {
			this.setState({
				isModalOpen: !this.state.isModalOpen
			});
		}
		handleSubmit(values) {
			this.toggleModal();
			this.props.addComment(this.props.dishId, values.rating, values.author, values.comment)
			// event.preventDefault();
		}
		
		render(){
			return (
				<React.Fragment>
				<Button outline onClick={this.toggleModal}><span className="fa fa-sign-in fa-lg"></span> Submit Comment</Button>
				<LocalForm onSubmit={(values) => this.handleSubmit(values)}>
				
				<Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
					<ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
					<ModalBody>
						<Form onSubmit={this.handleLogin}>
							<FormGroup className="form-group" >
						<Label htmlFor="Rating">Rating</Label>
						<Control.select
								model=".Rating"
								className="form-control"
								name="Rating"
								id="Rating"
							>
								<option></option>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
							</Control.select>
							</FormGroup>
							<FormGroup className="form-group"   >
                                <Label htmlFor="name" >Your name</Label>
                               <Control.text model=".name" id="name" name="name"
                                        className="form-control"
										validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}/>
										<Errors
                                        className="text-danger"
                                        model=".name"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                     />
							</FormGroup>
							<FormGroup className="form-group" >
                                <Label htmlFor="comment" >Comment</Label>
                               <Control.textarea model=".comment" id="comment" name="comment"
                                        rows="6"
                                        className="form-control" />
							</FormGroup>
							<Button type="submit" value="submit" color="primary">Submit</Button>
						</Form>
					</ModalBody>
				</Modal>
				</LocalForm>
				</React.Fragment>
				
			)
		}
	}
	  

   const DishDetail = (props) => {
	if (props.isLoading) {
		return(
			<div className="container">
				<div className="row">            
					<Loading />
				</div>
			</div>
		);
	}
	else if (props.errMess) {
		return(
			<div className="container">
				<div className="row">            
					<h4>{props.errMess}</h4>
				</div>
			</div>
		);
	}
	else if (props.dish != null) 
        if(props.dish != null){
            return (
                <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active> {props.dish.name} </BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>                
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish} />
                    </div>
                    <div className="col-12 col-md-5 m-1">
                        <RenderComments comments={props.comments}
						addComment={props.addComment} 
						dishId={props.dish.id}/>
                    </div>
                </div>
                </div>
            );
        }else{
            return(
                <div></div>
            );
        }        
    }

export default DishDetail;