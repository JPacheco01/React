import React, { Component } from 'react';
import Directory from './DirectoryComponent';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import Header from './HeaderComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import CampsiteInfo from './CampsiteInfoComponent';
import { postComment, postFeedback, fetchCampsites, fetchComments, fetchPromotions, fetchPartners } from '../redux/ActionCreators';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

/*
Update MainComponent.js to:
Import postFeedback
Add postFeedback to mapDispatchToProps.
Pass postFeedback to the Contact component from a Route component, where you are currently only passing the resetFeedbackForm prop. 
*/

console.log('fetchPartners: ', fetchPartners, typeof fetchPartners);
console.log('fetchCampsites: ', fetchCampsites, typeof fetchCampsites);

const mapStateToProps = state => ({
  campsites: state.campsites,
  comments: state.comments,
  partners: state.partners,
  promotions: state.promotions,
});


const mapDispatchToProps = {
    fetchCampsites: () => (fetchCampsites()),
    fetchComments: () => (fetchComments()),
    fetchPromotions: () => (fetchPromotions()),
    fetchPartners: () => (fetchPartners()),
    postComment: (campsiteId, rating, author, text) => (postComment(campsiteId, rating, author, text)),
    postFeedback: (feedback) => (postFeedback(feedback)),
    resetFeedbackForm: () => (actions.reset('feedbackForm')),
};

class Main extends Component {
    componentDidMount() {
        this.props.fetchCampsites();
        this.props.fetchComments();
        this.props.fetchPromotions();
        this.props.fetchPartners();
    }

    render() {

        const HomePage = () => {
          console.log(`Homepage partners on props: ${JSON.stringify(this.props.partners.partners, null, 2)}`);
          console.log(`Homepage campsites on props: ${JSON.stringify(this.props.campsites.campsites, null, 2)}`);
          // console.log('campsites filter: ', this.props?.campsites?.campsites?.filter(campsite => campsite.featured)[0])
            return (
                <Home
                            campsite={this.props.campsites.campsites.filter(campsite => campsite.featured)[0]}
                    campsitesLoading={this.props.campsites.isLoading}
                    campsitesErrMess={this.props.campsites.errMess}

                           promotion={this.props.promotions.promotions.filter(promotion => promotion.featured)[0]}
                    promotionLoading={this.props.promotions.isLoading}
                    promotionErrMess={this.props.promotions.errMess}

                            partner={this.props.partners.partners.filter(partner => partner.featured)[0]}
                    partnersLoading={this.props.partners.isLoading}
                    partnersErrMess={this.props.partners.errMess}
                />
            );
        }

        const CampsiteWithId = ({match}) => {
            return (
                <CampsiteInfo 
                    campsite={this.props?.campsites?.campsites?.filter(campsite => campsite.id === +match.params.campsiteId)[0]}
                    isLoading={this.props.campsites.isLoading}
                    errMess={this.props.campsites.errMess}
                    comments={this.props?.comments?.comments?.filter(comment => comment.campsiteId === +match.params.campsiteId)}
                    commentsErrMess={this.props.comments.errMess}
                    postComment={this.props.postComment}
                />
        );
      }

      return (
          <div>
            <Header />
            <TransitionGroup>
                <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
                    <Switch>
                        <Route path='/Home' component={HomePage} />
                        <Route exact path='/directory' render={() => (
                          <Directory campsites = {this.props.campsites} />
                        )} />
                        <Route path='/directory/:campsiteId' component={CampsiteWithId} />
                        <Route exact path='/contactus' render={() => (
                          <Contact
                            resetFeedbackForm={this.props.resetFeedbackForm}
                            postFeedback={this.props.postFeedback}
                          />
                        )} />
                        <Route exact path='/aboutus' render = {() => (
                          <About partners = {this.props.partners} />
                        )} />
                        <Redirect to ='/Home' />
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
            <Footer />
          </div>
      );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));