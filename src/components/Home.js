import '../styles/style.css';
import '../styles/home.css';
import { useState, useEffect, useContext } from 'react';
import { getCurrentFriends, getFriendRequests, getNewsFeed } from '../services/user.service';
import { UserContext } from '../App';
import NewPost from './modal/NewPost';
// import htmlDecode from '../services/formatting';
import NewsPost from './NewsPost';



/*
Here is where the bulk of the data grabbing will need to be done....
1. Grab friends list and display it on the sidebar
2. Grab 
*/



const Home = () => {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    // State to hold each piece of data for the current user
    const [friendsList, setFriendsList] = useState([]);
    const [friendReq, setFriendReq] = useState([]);
    const [newsFeed, setNewsFeed] = useState([]);
    const [updateNewsFeed, setUpdateNewsFeed] = useState(false);

    // State and function to manage the modal for a new news post
    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal);
    }


    useEffect(() => {
        // Grabs current users friends
        getCurrentFriends()
            .then(result => {
                setFriendsList(result.data.friends);
            })
            .catch(err => {
                console.log(err.result)
            });


    }, [])

    useEffect(() => {
        // Grabs current users friend requests
        getFriendRequests()
            .then(result => {
                setFriendReq(result.data.results);
            })
            .catch(err => {
                console.log(err.result)
            });
    }, []);

    useEffect(() => {
        getNewsFeed()
            .then(result => {
                if (result.data.new === true) {
                    setNewsFeed([]);
                } else {
                    setNewsFeed(result.data)
                }
            })
            .catch(err => {
                console.log(err.result)
            });
    }, [])

    useEffect(() => {
        //Used to refresh the page if the user has submitted a new post

        getNewsFeed()
            .then(result => {
                if (result.data.new === true) {
                    setNewsFeed([]);
                } else {
                    setNewsFeed(result.data)
                }
            })
            .catch(err => {
                console.log(err.result)
            });

        setUpdateNewsFeed(false)
    }, [updateNewsFeed])

    const PendingFriendReq = (props) => {
        const { contact } = props;
        if (contact.requestee._id === currentUser.id) {
            return null;
        } else {
            return (
                <div className='friend-aside-wrapper friends-style' key={contact._id}>
                    <button className='user-img'>{contact.requestee.first_name[0]}{contact.requestee.last_name[0]}</button>
                    <h3>{contact.requestee.first_name} {contact.requestee.last_name}</h3>
                </div>
            )
        }
    }

    return (
        <div className='home-wrapper'>
            <div className='left-sidebar'>

            </div>
            <div className='news'>
                <div className='new-post news-post'>
                    {/* Triggers a modal */}
                    <button className='user-img'>
                        {currentUser.first_name[0]}{currentUser.last_name[0]}
                    </button >
                    <button onClick={toggleModal}>{`What's on your mind, ${currentUser.first_name}?`}</button>
                </div>
                <div className='news-feed'>
                    {newsFeed.length === 0 ? <h3>Add some friends to see some content!</h3> : newsFeed.map(post => { return <NewsPost post={post} key={post._id} setUpdateNewsFeed={setUpdateNewsFeed} /> })}
                </div>


            </div>
            <div className='contact-sidebar'>
                <div id='home-friend-requests'>
                    <div>
                        <h2>Friend Requests</h2>
                        <a href='/friends'>See All</a>
                    </div>
                    {friendReq.map(contact => { return <PendingFriendReq contact={contact} key={contact._id}/> })}
                </div>
                <div id='home-friends' >
                    <h2>Friends</h2>
                    {friendsList.map(contact => {
                        return (<div className='friend-aside-wrapper friends-style' key={contact._id}>
                            <button className='user-img'>{contact.first_name[0]}{contact.last_name[0]}</button>
                            <h3>{contact.first_name} {contact.last_name}</h3>
                        </div>)
                    })}
                </div>
            </div>
            {modal ? <NewPost toggleModal={toggleModal} setUpdateNewsFeed={setUpdateNewsFeed} /> : null}
        </div >
    )
}

export default Home