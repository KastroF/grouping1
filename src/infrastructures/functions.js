import React from "react";
import axios from "axios";

export const useFetchFunctions = () => {

  

    const fetchWithTimeout =  async (resource, options = {}) => {

        const {timeout = 30000} = options;

        const controller = new AbortController();

        const id = setTimeout(() => {
            
            controller.abort()

        }, timeout);

        const response = await fetch(resource, {
            ...options , 
            signal: controller.signal
        }); 


        clearTimeout(id)

        return response

    }


  const postAvecFichier = async (url, formData, token) => {

    try {

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        
      });
  
      console.log('Réponse serveur:', response.data);

      if(response.data){

        return response.data;

      }

    } catch (error) {
            console.log(error);
            console.log('Erreur Axios :', error.message);
            console.log('Détails :', error.response?.data); // 
       
    }

  }


const postWithFile = async (url, body, token) => {
  
    if(token){

        try {
          const response = await axios.post(url, body, {
            headers: {
              Authorization: `Bearer ${token}`,
           
            },
          });
    
      
            const responseJson = await response.json();


            
            return responseJson
    
          } catch (error) {
            console.error(error);
        
          }

    }else{

        try {
            const response = await fetch(url, {
              method: 'POST',
              body: body,
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
      
            const responseJson = await response.json();
            
            return responseJson
    
          } catch (error) {
            console.error(error);
           
          }
    }

   

}


const postFunction = async (url, body, token) => {

   // Alert.alert("i");

   if(token){

    try{
  
  
        const response = await fetchWithTimeout(url,  {
          method: 'POST', 
          
          headers: {
             'Content-Type': 'application/json', 
             'Authorization': `Bearer ${token}`,
             
          }, 
          
             body: JSON.stringify(body), 
             timeout: 100000
             
         
         })
      
         //setLoading(false);
      
        const responseJson = await response.json(); 
    
          
       return responseJson;
        
    
       
    
      }catch(e){
    
          console.log("c'est ici "+e); 
        
       
      }

   }else{

    try{
  
  
        const response = await fetchWithTimeout(url,  {
          method: 'POST', 
          
          headers: {
             'Content-Type': 'application/json', 
             
             
          }, 
          
             body: JSON.stringify(body), 
             timeout: 100000
             
         
         })
      
         //setLoading(false);
      
        const responseJson = await response.json(); 
    
          
       return responseJson;
        
    
       
    
      }catch(e){
    
          console.log("c'est ici "+e); 
         
       
      }

   }

  
  }

  const laFonctionGet =  async (url, token) => {

    if(token){


        try{

            const response = await fetchWithTimeout(url, {
                method: "GET",     
                headers: {
                
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}`,
                }, 
                timeout: 20000
            }); 
      
            const responseJson = await response.json(); 
      
            return responseJson;
      
          
      
        }catch(e){
      
          console.log(e);
  
         // Alert.alert("Vérifiez votre connexion internet")
        
        }

    }else{

        try{

            const response = await fetchWithTimeout(url, {
                method: "GET",     
                headers: {
                
                  'Content-Type': 'application/json', 
                }, 
                timeout: 20000
            }); 
      
            const responseJson = await response.json(); 
      
            return responseJson;
      
          
      
        }catch(e){
      
          console.log(e);
     
        //  Alert.alert("Vérifiez votre connexion internet")
        
        }

    }


}


const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  function showAlertWithObjectFields(obj) {
    // Vérifier si l'objet est valide
    if (!obj || typeof obj !== 'object') {
      alert('Invalid object');
      return;
    }
    
    // Convertir l'objet en une chaîne de caractères formatée
    let message = 'Object Fields:\n';
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        message += `${key}: ${obj[key]}\n`;
      }
    }
    
    // Afficher l'alerte avec les champs de l'objet
    alert(message);
  }

  function timeAgo(date) {
    const now = new Date();
    const diff = Math.abs(now - date); // Différence en millisecondes
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
  
    if (seconds < 60) {
      return seconds === 1 ? "il y a 1s" : `il y a ${seconds}s`;
    } else if (minutes < 60) {
      return minutes === 1 ? "il y a 1 mn" : `il y a ${minutes} mn`;
    } else if (hours < 24) {
      return hours === 1 ? "il y a 1 heure" : `il y a ${hours} heures`;
    } else if (days < 30) {
      return days === 1 ? "il y a 1 jour" : `il y a ${days} jours`;
    } else if (months < 12) {
      return months === 1 ? "il y a 1 mois" : `il y a ${months} mois`;
    } else {
      return years === 1 ? "il y a 1 an" : `il y a ${years} ans`;
    }
  }

  function timeAgoEN(date) {
    const now = new Date();
    const diff = Math.abs(now - date); // difference in ms
  
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
  
    if (seconds < 60) {
      return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    } else if (hours < 24) {
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    } else if (days < 30) {
      return days === 1 ? "1 day ago" : `${days} days ago`;
    } else if (months < 12) {
      return months === 1 ? "1 month ago" : `${months} months ago`;
    } else {
      return years === 1 ? "1 year ago" : `${years} years ago`;
    }
  }
  

    return {

        postFunction, 
        laFonctionGet, 
        timeAgo,
        validateEmail, 
        postWithFile, 
        showAlertWithObjectFields, 
        postAvecFichier, 
        timeAgoEN

    }
}