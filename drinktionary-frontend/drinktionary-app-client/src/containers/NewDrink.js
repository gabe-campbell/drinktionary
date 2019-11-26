import React, { useRef, useState } from "react";
import { API } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { s3Upload } from "../libs/awsLib";
import config from "../config";
import LoaderButton from "../components/LoaderButton";
import "./NewDrink.css";

export default function NewDrink(props) {
  const file = useRef(null);
  const [content, setContent] = useState("");
  const [drinkTitle, setDrinkTitle] = useState("");
  const [mainLiquor, setMainLiquor] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
      return;
    }

    setIsLoading(true);

    try {
      const attachment = file.current ? await s3Upload(file.current) : null;

      await createDrink ({ drinkTitle, mainLiquor, content, attachment });
      props.history.push("/");
    } catch (e) {
      alert(e);
      setIsLoading(false);
    }
  }


  function createDrink(drink) {
    return API.post("drinks", "/drinks", {
      body: drink
    });
  }

  return (
    <div className="NewDrink">
     <form onSubmit={handleSubmit}>
     <FormGroup controlId="drinkTitle">
        <ControlLabel>Drink Title</ControlLabel>
        {/*<FormControl value={drinkTitle}/>*/}
        <FormControl value={drinkTitle} componentClass="input" onChange={e => setDrinkTitle(e.target.value)} />
     </FormGroup>
     <FormGroup controlId="mainLiquor">
         <ControlLabel>Main Liquor</ControlLabel>
         {/*<FormControl value={mainLiquor}/>*/}
         <FormControl value={mainLiquor} componentClass="input" onChange={e => setMainLiquor(e.target.value)} />
     </FormGroup>
	 <FormGroup controlId="content">
        <ControlLabel>Recipe</ControlLabel>
	    <FormControl value={content} componentClass="textarea" onChange={e => setContent(e.target.value)} />
	 </FormGroup>
	 <FormGroup controlId="file">
	   <ControlLabel>Attachment</ControlLabel>
	   <FormControl onChange={handleFileChange} type="file" />
	 </FormGroup>
     <LoaderButton block type="submit" bsSize="large" bsStyle="primary" isLoading={isLoading} disabled={!validateForm()}>
	   Create
	 </LoaderButton>
      </form>
    </div>
  );
}
