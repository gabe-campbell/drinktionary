import React, {useEffect, useState} from "react";
import {API} from "aws-amplify";
import {LinkContainer} from "react-router-bootstrap";
import {ListGroup, ListGroupItem, PageHeader} from "react-bootstrap";
import "./Home.css";

export default function Home(props) {
  const [drinks, setDrinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!props.isAuthenticated) {
        return;
      }


      try {
        const drinks = await loadDrinks();
        setDrinks(drinks);
      } catch (e) {
        alert(e);
      }

      setIsLoading(false);
    }

    onLoad().then(r => {});
  }, [props.isAuthenticated]);

  function loadDrinks() {
    return API.get("drinks", "/drinks");
  }

  function renderDrinksList(drinks) {
    return [{}].concat(drinks).map((drink, i) =>
      i !== 0 ? (
        <LinkContainer key={drink.drinkId} to={`/drinks/${drink.drinkId}`}>
          <ListGroupItem header={drink.drinkTitle.trim().split("\n")[0]}>
            {"Created: " + new Date(drink.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/drinks/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new drink
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Drinktionary</h1>
        <p>A Dictionary for Drinks</p>
      </div>
    );
  }

  function renderDrinks() {
    return (
      <div className="drinks">
        <PageHeader>Your Drinks</PageHeader>
        <ListGroup>
          {!isLoading && renderDrinksList(drinks)}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {props.isAuthenticated ? renderDrinks() : renderLander()}
    </div>
  );
}
