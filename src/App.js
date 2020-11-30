import './App.css';
import { authProvider } from './authProvider';
import { AzureAD, AuthenticationState } from 'react-aad-msal';
import Main from './Main';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
	
  return (
    
    <div className="App">
		
	<AzureAD provider={authProvider} forceLogin={true}>
  {
    ({login, logout, authenticationState, error, accountInfo}) => {
		
      switch (authenticationState) {
        case AuthenticationState.Authenticated:
          return (
			  <div><Main jwt={accountInfo.jwtIdToken}/></div>
          );
        case AuthenticationState.Unauthenticated:
          return (
            <div>
              {error && <p><span>An error occured during authentication, please try again!</span></p>}
              <p>
                <span>Hey stranger, you look new!</span>
                <button onClick={login}>Login</button>
              </p>
            </div>
          );
        case AuthenticationState.InProgress:
          return (<p>Authenticating...</p>);
      }
    }
  }
  
</AzureAD>

    </div>
  );
}

export default App;
