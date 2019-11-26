import React, { useRef, useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { s3Upload } from "../libs/awsLib";
import config from "../config";
import "./Drinks.css";

export default function Drinks(props) {
  const file = useRef(null);
  const [drink, setDrink] = useState(null);
  const [content, setContent] = useState("");
  const [drinkTitle, setDrinkTitle] = useState("");
  const [mainLiquor, setMainLiquor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadDrink() {
      return API.get("drinks", `/drinks/${props.match.params.id}`);
    }

    async function onLoad() {
      try {
        const drink = await loadDrink();
        const { drinkTitle, mainLiquor, content, attachment } = drink;

        if (attachment) {
          drink.attachmentURL = await Storage.vault.get(attachment);
        }

        setDrinkTitle(drinkTitle);
        setMainLiquor(mainLiquor);
        setContent(content);
        setDrink(drink);
      } catch (e) {
        alert(e);
      }
    }

    onLoad();
  }, [props.match.params.id, setContent]);

  function validateForm() {
    return content.length > 0;
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  function saveDrink(drink) {
    return API.put("drinks", `/drinks/${props.match.params.id}`, {
      body: drink
    });
  }

  async function handleSubmit(event) {
    let attachment;

    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
          1000000} MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
      }

      await saveDrink({
        drinkTitle,
        mainLiquor,
        content,
        attachment: attachment || drink.attachment
      });
      console.log("Getting here");
      props.history.push("/");
    } catch (e) {
      alert(e);
      console.log("Failing here");
      setIsLoading(false);
    }
  }

  function deleteDrink() {
    return API.del("drinks", `/drinks/${props.match.params.id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this drink?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteDrink();
      props.history.push("/");
    } catch (e) {
      alert(e);
      setIsDeleting(false);
    }
  }

  return (
    <div className="Drinks">
      {drink && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="drinkTitle">
            <ControlLabel>Drink Title</ControlLabel>
            <FormControl
                value={drinkTitle}
                componentClass="input"
                onChange={e => setDrinkTitle(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="mainLiquor">
            <ControlLabel>Main Liquor</ControlLabel>
            <FormControl
                value={mainLiquor}
                componentClass="input"
                onChange={e => setMainLiquor(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="content">
            <ControlLabel>Recipe</ControlLabel>
            <FormControl
              value={content}
              componentClass="textarea"
              onChange={e => setContent(e.target.value)}
            />
          </FormGroup>
          {drink.attachment && (
            <FormGroup>
              <ControlLabel>Attachment</ControlLabel>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={drink.attachmentURL}
                >
                  {formatFilename(drink.attachment)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!drink.attachment && <ControlLabel>Attachment</ControlLabel>}
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
}
