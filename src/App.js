import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { API, graphqlOperation } from 'aws-amplify';
import { saveLink } from './graphql/mutations';
import { lookupHash } from './graphql/queries';
import { 
  BrowserRouter as Router, 
  Route, 
  Switch, 
  useParams
} from "react-router-dom";

const AppStyles = styled.div.attrs(() => ({
  className: "app-styles"
}))`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Form = styled.form.attrs(() => ({
  className: "app-form"
}))`
  padding: 8px;
  width: 30vw;
  display: block;
  border: 1px solid #aaa;
`;

const Input = styled.input.attrs(() => ({
  className: "app-input"
}))`
  padding: 8px;
  margin: 8px;
  width: calc(100% - 16px - 2px - 16px - 2px);
  display: block;
`;

const Button = styled.button.attrs(() => ({
  className: "app-button"
}))`
  padding: 8px;
  margin: 8px;
  width: calc(100% - 8px - 8px);
  display: block;

  &:hover {
    cursor: pointer;
  }
`;

const Warning = styled.div.attrs(() => ({
  className: "warning-wrapper"
}))`
  padding: 8px;
  width: 30vw;
  display: block;
  border: 1px solid #aaa;
`;

const WarningMessage = styled.p.attrs(() => ({
  className: "warning-message"
}))`
  text-align: center;
  margin: 8px 8px 32px;
`;

const ErrorMessage = styled.h1.attrs(() => ({
  className: "error-message"
}))``;

const LoadingMessage = styled.h1.attrs(() => ({
  className: "loading-message"
}))``;

const SavedHash = styled.h1.attrs(() => ({
  className: "saved-hash"
}))``;

function LookupHashAndRedirect() {
  const { hash } = useParams();
  const [ agreedToExternal, setAgreedToExternal ] = useState(false);
  const [ url, setUrl ] = useState('');
  const [ error, setError ] = useState('');

  useEffect(async () => {
    try {
      const response = await API.graphql(
        graphqlOperation(lookupHash, { hash })
      );
  
      setUrl(response.data.lookupHash)        
    } catch {
      setError('The hash you entered could not be found.')
    }
  }, [hash])

  useEffect(() => {
    if (
      url && 
      agreedToExternal
    ) {
      window.location.href = url;
    }
  }, [url, agreedToExternal]);

  if (url) {
    return (
      <Warning>
        <WarningMessage>We've not validated the links content. Visit at your own risk! </WarningMessage>
        <Button data-attr-url={url} onClick={() => setAgreedToExternal(true)}>Visit Link</Button>
      </Warning>
    );  
  } else if (error) {
    return <ErrorMessage className="error">{ error }</ErrorMessage>;  
  } else {
    return <LoadingMessage className="loading">Loading...</LoadingMessage>;  
  }
}

function HashForm() {
  const [url, setUrl] = useState('');
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.graphql(
        graphqlOperation(saveLink, { input: url })
      );
  
      setHash(response.data.saveLink.hash);
    } catch ({ errors }) {
      setUrl('');
      setError(errors.map(e => e.message + ' '));    
      setTimeout(setError, 5000);
    } finally {
      setLoading(false);
    }
  };

  if (hash) {
    return <SavedHash className="saved-hash">{hash}</SavedHash>;  
  } else {
    return (
      <Form onSubmit={onSubmit}>
        <Input 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder={ error ? error : "Give me a valid url and I'll make it shorter. Wubba Lubba Dub Dub!" } 
        />
        <Button disabled={!url || loading}>Get Hash</Button>
      </Form>
    );  
  }
}

function Routes() {
  return (
    <>
      <Route path="/:hash">
        <LookupHashAndRedirect />
      </Route>

      <Route exact path="/">
        <HashForm />
      </Route>
    </>
  );
}

function App() {
  return (
    <AppStyles>
      <Router>
        <Switch>
          <Routes />    
        </Switch>
      </Router>
    </AppStyles>
  );
}

export default App;
