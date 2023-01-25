import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { getHome } from '../api/requests/requests';

import { Grid, Container } from '@mui/material';

import Navbar from '../components/Navbar';
// import Usercard from '../components/Usercard'
import Compose from '../components/Compose';
import Feed from '../components/Feed';
import Loading from '../components/Loading';

function Home() {
  const user = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  console.log(user);
  const refresh = () => {
    getHome(setPosts, setLoading);
  };

  useEffect(() => {
    if (!user.token) navigate('/login');
    refresh();
  }, [navigate, user]);

  if (!user.token) return;

  return (
    <>
      <Navbar />
      <Container>
        <Grid item sx={{ marginTop: 5 }}>
          <Compose refresh={refresh} />
          {loading ? (
            <Loading />
          ) : (
            posts.map((post, index) => {
              return <Feed key={index} id={post.user} content={post.content} date={post.date} />;
            })
          )}
        </Grid>
        <Grid item sx={{ background: 'blue' }}></Grid>
      </Container>
    </>
  );
}

export default Home;
