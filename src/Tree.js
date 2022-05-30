import React, {useRef,useState,useEffect} from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import potimg from "./pot.png";
import garden from "./garden.jpg";

var searchlevel=""
var history=[""]
var trunklabel="Life"
var trunklabellevel=""
var description=""
var img=""
var descriptions=[]
var searchword=""
function Tree(props) {
  const [taxonomyTree,setTaxonomyTree] = useState('');
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    getHighestLevelOrganismData()
  },[])

  function makeTaxonomyTree(organisms){
    let taxonomy={}
    for (let animal of organisms){
      if(searchlevel==""){
        if(animal.kingdom&&animal.phylum){
          if(animal.kingdom){
            if(!Object.keys(taxonomy).includes(`Kingdom: ${animal.kingdom}`)){
              taxonomy[`Kingdom: ${animal.kingdom}`]={}
            }
          }
          if (animal.phylum){
            if(!Object.keys(taxonomy[`Kingdom: ${animal.kingdom}`]).includes(`Phylum: ${animal.phylum}`)){
              taxonomy[`Kingdom: ${animal.kingdom}`][`Phylum: ${animal.phylum}`]={}
            }
          }
        }
      }

      if(searchlevel=="Kingdom"){
        if(animal.phylum&&animal.class){
          if(animal.phylum){
            if(!Object.keys(taxonomy).includes(`Phylum: ${animal.phylum}`)){
              taxonomy[`Phylum: ${animal.phylum}`]={}
            }
          }
          if (animal.class){
            if(!Object.keys(taxonomy[`Phylum: ${animal.phylum}`]).includes(`Class: ${animal.class}`)){
              taxonomy[`Phylum: ${animal.phylum}`][`Class: ${animal.class}`]={}
            }
          }
        }
      }

      if(searchlevel=="Phylum"){
        if(animal.class&&animal.order){
          if (animal.class){
            if(!Object.keys(taxonomy).includes(`Class: ${animal.class}`)){
              taxonomy[`Class: ${animal.class}`]={}
            }
          }
          if (animal.order){
            if(!Object.keys(taxonomy[`Class: ${animal.class}`]).includes(`Order: ${animal.order}`)){
              taxonomy[`Class: ${animal.class}`][`Order: ${animal.order}`]={}
            }
          }
        }
      }

      if(searchlevel=="Class"){
        if(animal.order&&animal.family){
          if (animal.order){
            if(!Object.keys(taxonomy).includes(`Order: ${animal.order}`)){
              taxonomy[`Order: ${animal.order}`]={}
            }
          }
          if (animal.family){
            if(!Object.keys(taxonomy[`Order: ${animal.order}`]).includes(`Family: ${animal.family}`)){
              taxonomy[`Order: ${animal.order}`][`Family: ${animal.family}`]={}
            }
          }
        }
      }

      if(searchlevel=="Order"){
        if(animal.family&&animal.genus){
          if (animal.family){
            if(!Object.keys(taxonomy).includes(`Family: ${animal.family}`)){
              taxonomy[`Family: ${animal.family}`]={}
            }
          }
          if (animal.genus){
            if(!Object.keys(taxonomy[`Family: ${animal.family}`]).includes(`Genus: ${animal.genus}`)){
              taxonomy[`Family: ${animal.family}`][`Genus: ${animal.genus}`]={}
            }
          }
        }
      }

      if(searchlevel=="Family"){
        if(animal.genus&&animal.species){
          if (animal.genus){
            if(!Object.keys(taxonomy).includes(`Genus: ${animal.genus}`)){
              taxonomy[`Genus: ${animal.genus}`]={}
            }
          }
          if (animal.species){
            if(!Object.keys(taxonomy[`Genus: ${animal.genus}`]).includes(`Species: ${animal.species}`)){
              taxonomy[`Genus: ${animal.genus}`][`Species: ${animal.species}`]={}
            }
          }
        }
      }
      if(searchlevel=="Genus"){
        if (animal.species){
          if(!Object.keys(taxonomy).includes(`Species: ${animal.species}`)){
            taxonomy[`Species: ${animal.species}`]={}
          }
        }
      }
    }
    delete taxonomy[`Kingdom: incertae sedis`]
    delete taxonomy[`Phylum: incertae sedis`]
    delete taxonomy[`Class: incertae sedis`]
    delete taxonomy[`Order: incertae sedis`]
    delete taxonomy[`Family: incertae sedis`]
    delete taxonomy[`Genus: incertae sedis`]
    delete taxonomy[`Species: incertae sedis`]
    console.log("getting taxonomy",taxonomy);
    setTaxonomyTree(JSON.stringify(taxonomy))
  }


  async function getHighestLevelOrganismData(){
    setLoading(true)
    descriptions={}
    img=''

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'wiki-briefs.p.rapidapi.com',
        'X-RapidAPI-Key': '24f2c04f41msh794ec7d5b9283dcp1ebdf7jsn01969526d5ac'
      }
    };

    await fetch(`https://wiki-briefs.p.rapidapi.com/search?q=life&topk=6`, options)
      .then(response => response.json())
      .then(response => {console.log(response,"WIKIPEDIA");
      img=response.image;
      description=response.summary.join('\r\n');
    })
    .catch(err => console.error(err));

    await fetch('https://api.allorigins.win/get?url=https://api.gbif.org/v1/species?limit=1000')
    .then(response => response.json())
    .then(response =>JSON.parse(response.contents))
    .then(response =>{
      console.log("getting data",response.results);
      makeTaxonomyTree(response.results);
    })
    .catch(err => console.error(err));
    setLoading(false)
  }

  async function upOneLevel(event){
    console.log("searchlevel before",searchlevel)
    if(searchlevel=="Kingdom"){
      searchlevel=""
    }
    if(searchlevel=="Phylum"){
      searchlevel="Kingdom"
    }
    if(searchlevel=="Class"){
      searchlevel="Phylum"
    }
    if(searchlevel=="Order"){
      searchlevel="Class"
    }
    if(searchlevel=="Family"){
      searchlevel="Order"
    }
    if(searchlevel=="Genus"){
      searchlevel="Family"
    }
    if(searchlevel=="Species"){
      searchlevel="Genus"
    }
    console.log("searchlevel after",searchlevel)
    console.log("history",history)
    history.pop()
    console.log("history",history)
    console.log(history[history.length-1])

    if (history[history.length-1]==""){
      console.log("getting highest level")
      searchlevel=""
      await getHighestLevelOrganismData()
    }else{
      await narrowOptions(history[history.length-1],false)
    }
  }

  async function narrowOptions(term,goingdown,secondcategory){
    setLoading(true)
    searchlevel=term.target.value.split(': ')[0]
    let searchterm=term.target.value.split(': ')[1]
    trunklabel=term.target.value.split(': ')[1]
    trunklabellevel=term.target.value.split(': ')[0]
        console.log(term.target.value,secondcategory)
    if(goingdown){
      if (secondcategory){
        let termtwo={}
        termtwo.target={}
        termtwo.target.value=secondcategory
        history.push(termtwo)
      }
      let termone={}
      termone.target={}
      termone.target.value=term.target.value
      history.push(term)
    }
    console.log(term.target.value,secondcategory)
    let highertaxonkey=await fetch(`https://api.allorigins.win/get?url=https://api.gbif.org/v1/species/match?${trunklabellevel.toLowerCase()}=${searchterm}`)
      .then(response => response.json())
      .then(response =>JSON.parse(response.contents))
      .then(response =>{
        return response.usageKey})
        .catch(err => console.error(err));
        console.log(highertaxonkey)

          await fetch(`https://api.allorigins.win/get?url=https://api.gbif.org/v1/species/${highertaxonkey}/media`)
            .then(response => response.json())
            .then(response =>JSON.parse(response.contents))
            .then(response =>{
              console.log("IMAGES",response.results);
              if (response.results.length>0){
                console.log("GETTING IMAGE")
                img=response[`results`][0][`identifier`];
              }
            })
            .catch(err => console.error(err));


            const options = {
              method: 'GET',
              headers: {
                'X-RapidAPI-Host': 'wiki-briefs.p.rapidapi.com',
                'X-RapidAPI-Key': '24f2c04f41msh794ec7d5b9283dcp1ebdf7jsn01969526d5ac'
              }
            };
            await fetch(`https://wiki-briefs.p.rapidapi.com/search?q=${searchterm}&topk=6`, options)
              .then(response => response.json())
              .then(response => {console.log(response,"WIKIPEDIA");
              img=response.image;
              description=response.summary.join('\r\n');
            })
              .catch(err => console.error(err));



        await fetch(`https://api.allorigins.win/get?url=https://api.gbif.org/v1/species/search?limit=100%26highertaxon_key=${highertaxonkey}`  )
          .then(response => response.json())
          .then(response =>JSON.parse(response.contents))
          .then(response =>{
            console.log(response.results);
            makeTaxonomyTree(response.results);
          }).catch(err => console.error(err))
          setLoading(false)
                }

                async function search(){
                  setLoading(true)
                  console.log(`https://api.allorigins.win/get?url=https://api.gbif.org/v1/species/match?name=${searchword}`)
                  let highertaxonkey=await fetch(`https://api.allorigins.win/get?url=https://api.gbif.org/v1/species/match?name=${searchword}`)
                    .then(response => response.json())
                    .then(response =>JSON.parse(response.contents))
                    .then(response =>{
                      return response.usageKey})
                      .catch(err => console.error(err));
                      console.log(highertaxonkey)


                      const options = {
                        method: 'GET',
                        headers: {
                          'X-RapidAPI-Host': 'wiki-briefs.p.rapidapi.com',
                          'X-RapidAPI-Key': '24f2c04f41msh794ec7d5b9283dcp1ebdf7jsn01969526d5ac'
                        }
                      };

                      await fetch(`https://wiki-briefs.p.rapidapi.com/search?q=${searchword}&topk=6`, options)
                        .then(response => response.json())
                        .then(response => {console.log(response,"WIKIPEDIA");
                        img=response.image;
                        description=response.summary.join('\r\n');
                      })
                      .catch(err => console.error(err));


                        await fetch(`https://api.allorigins.win/get?url=https://api.gbif.org/v1/species/${highertaxonkey}/media`)
                          .then(response => response.json())
                          .then(response =>JSON.parse(response.contents))
                          .then(response =>{
                            console.log("IMAGES",response.results);
                            if (response.results.length>0){
                              console.log("GETTING IMAGE")
                              img=response[`results`][0][`identifier`];
                            }
                          })
                          .catch(err => console.error(err));

                      await fetch(`https://api.allorigins.win/get?url=https://api.gbif.org/v1/species/search?limit=100%26highertaxon_key=${highertaxonkey}`  )
                        .then(response => response.json())
                        .then(response =>JSON.parse(response.contents))
                        .then(response =>{
                          console.log(response.results);
                          history=[""]
                          let animal=response.results[0]
                          if(animal.kingdom){
                            let historyitem={}
                            historyitem.target={}
                            historyitem.target.value=`Kingdom: ${animal.kingdom}`
                            history.push(historyitem)
                            searchlevel="Kingdom"
                          }
                          if(animal.phylum){
                            let historyitem={}
                            historyitem.target={}
                            historyitem.target.value=`Phylum: ${animal.phylum}`
                            history.push(historyitem)
                            searchlevel="Phylum"
                          }
                          if(animal.class){
                            let historyitem={}
                            historyitem.target={}
                            historyitem.target.value=`Class: ${animal.class}`
                            history.push(historyitem)
                            searchlevel="Class"
                          }
                          if(animal.order){
                            let historyitem={}
                            historyitem.target={}
                            historyitem.target.value=`Order: ${animal.order}`
                            history.push(historyitem)
                            searchlevel="Order"
                          }
                          if(animal.family){
                            let historyitem={}
                            historyitem.target={}
                            historyitem.target.value=`Family: ${animal.family}`
                            history.push(historyitem)
                            searchlevel="Family"
                          }
                          if(animal.genus){
                            let historyitem={}
                            historyitem.target={}
                            historyitem.target.value=`Genus: ${animal.genus}`
                            history.push(historyitem)
                            searchlevel="Genus"
                          }
                          if(animal.species){
                            let historyitem={}
                            historyitem.target={}
                            historyitem.target.value=`Species: ${animal.species}`
                            history.push(historyitem)
                            searchlevel="Species"
                          }
                          console.log(response.results[0],history,"HISTORY")
                          makeTaxonomyTree(response.results);
                        }).catch(err => console.error(err));
                        setLoading(false)
                              }



                const sketch = (p5) => {
                  let theta,input,button
                  let numberofgroups=0
                  let pot

                  p5.preload = () => {
                    p5.loadImage(potimg, imgg => {
                      pot = imgg;
                      console.log(img,"IMG")
                    });
                  }

                  p5.setup = () => {
                    if(taxonomyTree){
                      p5.createCanvas(p5.windowWidth,p5.windowHeight+200,p5.CANVAS);
                      p5.clear();
                      p5.stroke(255);
                      p5.strokeWeight(40)
                      let a = 15
                      theta = p5.radians(a);
                      p5.translate(350,p5.height-250);
                      p5.stroke(101, 67, 33)
                      if(pot){
                        p5.image(pot, -75, 0,150,150);
                      }
                      p5.line(0,0,0,-180);
                      p5.textSize(27);
                      p5.strokeWeight(2)
                      p5.stroke(0)
                      p5.fill(255);
                      p5.push();
                      p5.translate(0,-20);
                      p5.rotate(-1.5708);
                      p5.text(trunklabel, 10, 5);
                      p5.pop();
                      (async function(){
                        p5.translate(0,-180);
                        p5.rotate(-1.5708)

                        let taxonomy=JSON.parse(taxonomyTree)
                        let keys=Object.keys(taxonomy)
                        keys=keys.sort(() => Math.random() - 0.5);

                        keys=keys.slice(0,6)
                        let radiangapbetweenbranches=(180/keys.length) * (Math.PI / 180);
                        p5.rotate(radiangapbetweenbranches/2)
                        let radianprogress=-1.5708

                        for (let [index, group] of keys.entries()){
                          p5.push()
                          p5.rotate(1.5708)
                          p5.rotate(radianprogress)
                          p5.stroke(101, 67, 33)
                          p5.strokeWeight(30)
                          p5.line(0,0,0,-180)

                          p5.push()
                          if(radianprogress>-0.1){
                            p5.translate(0,-70);
                            p5.rotate(-1.5708)
                          }
                          if(radianprogress<=-0.1){
                            p5.translate(0,-160);
                            p5.rotate(1.5708)
                          }
                          p5.textSize(23);
                          p5.strokeWeight(2)
                          p5.stroke(0)
                          p5.fill(255);
                          let txt=group.split(': ')[1]
                          txt=txt.slice(0,13)
                          p5.text(txt, 10, 5)
                          p5.pop()
                          p5.translate(0,-180);
                          radianprogress=radianprogress+radiangapbetweenbranches
                          branch(taxonomy[`${group}`],140,radianprogress,group)
                          p5.pop()

                        }
                      })()
                    };
                  }


                  async function branch(group,size,radianprog,gr){
                    p5.rotate(-1.5708)
                    let radianprogres=radianprog
                    radianprogres=radianprogres-1.5708
                    let key=Object.keys(group)
                    if(key.length>6){
                      key=key.sort(() => Math.random() - 0.5);
                      key=key.slice(0,6)
                    }
                    let radiangapbetweenbranches=(180/key.length) * (Math.PI / 180);
                    p5.rotate(radiangapbetweenbranches/2)
                    for (let [index, grou] of key.entries()){
                      p5.push()
                      p5.stroke(101, 67, 33)
                      p5.strokeWeight(size/8)
                      p5.line(0,0,0,-size)
                      p5.push()
                      p5.stroke(0,128,0)
                      let x=Math.random()
                      if(x<0.5){
                        p5.ellipse(size/4, 0, size/4, size/16);
                        p5.ellipse(-size/4, -size/2, size/4, size/16);
                        p5.ellipse(size/4, -size, size/4, size/16);
                      }else{
                        p5.ellipse(-size/4, 0, size/4, size/16);
                        p5.ellipse(size/4, -size/2, size/4, size/16);
                        p5.ellipse(-size/4, -size, size/4, size/16);
                      }
                      p5.ellipse(0, -size, size/16,size/4);


                      p5.pop()
                      p5.push()
                      if(radianprogres>-0){
                        p5.translate(0,-size/10);
                        p5.rotate(-1.5708)
                      }else{
                        p5.translate(0,-size);
                        p5.rotate(1.5708)
                      }
                      p5.textSize(size/10);
                      p5.strokeWeight(2)
                      p5.stroke(0)
                      p5.fill(255);
                      let txt=grou.split(': ')[1]
                      txt=txt.slice(0,13)
                      p5.text(txt, 10, 5)
                      p5.pop()
                      p5.pop()
                      radianprogres=radianprogres+radiangapbetweenbranches
                      p5.rotate(radiangapbetweenbranches)
                    }
                  };



                };
                let taxonom
                let keys
                let titleone
                let titletwo

                if(taxonomyTree){
                  taxonom=JSON.parse(taxonomyTree)
                  console.log(taxonom)
                  keys=Object.keys(taxonom)
                  console.log("keys",keys)
                  if (keys.length>0){
                    titleone=keys[0]
                    titleone=titleone.split(": ")
                    titleone=titleone[0]
                  }
                }

                if(titleone=="Kingdom"){
                  titletwo="Phylum"
                }
                if(titleone=="Phylum"){
                  titletwo="Class"
                }
                if(titleone=="Class"){
                  titletwo="Order"
                }
                if(titleone=="Order"){
                  titletwo="Family"
                }
                if(titleone=="Family"){
                  titletwo="Genus"
                }
                if(titleone=="Genus"){
                  titletwo="Species"
                }


                console.log("titleone",titleone)

                let colors=["green","red","purple","blue","orange","yellow","pink","green","red","purple","blue","orange","yellow","pink","green","red","purple","blue","orange","yellow","pink","green","red","purple","blue","orange","yellow","pink","green","red","purple","blue","orange","yellow","pink","green","red","purple","blue","orange","yellow","pink","green","red","purple","blue","orange","yellow","pink","green","red","purple","blue","orange","yellow","pink","green","red","purple","blue","orange","yellow","pink","green","red","purple","blue","orange","yellow","pink"]
                var histor=[]
                if (history){
                  if (history.length>1){
                    console.log(history)
                histor=history.map(item=>{
                  if(item!==""){
                  return item.target.value
                  }
                  })
                  histor.shift()
                  }
                }

                function handleChange(event) {
                    console.log(event.target.value);
                    searchword=event.target.value
                  }


                console.log(histor,"histor")
                return (<>
                  <div style={{display:loading?"inline":"none",margin:"4vw",padding:"4vw",top:"100px",left:"100px"}}>
                  <div class="loader" style={{margin:"4vw"}}></div><h1 style={{marginLeft:"4vw",fontSize:"250%",display:"inline",color:"#3498db"}}>Loading</h1>
                  </div>
                  <div style={{display:loading?"none":"block"}}>
                  <div style={{transform:"translateY(-140px)"}}>
                  <ReactP5Wrapper sketch={sketch} img={img}/>
                  </div>
                  <div style={{width:"100vw",margin:"0"}}>
                  <img src={garden} style={{width:"100vw",height:"100vh",top:"0",left:"0",position:"absolute",zIndex:"-10"}}/>
                  <h1 style={{paddingLeft:"2vw",marginTop:"-25vh"}}>{trunklabellevel} {trunklabel}</h1>
                  {(img||description)&&<div style={{width:"100vw",display:"flex"}}>
                  <div style={{width:"46vw",marginLeft:"2vw"}}>{img&&<img style={{width:"42vw"}} src={img}></img>}</div>
                  <div style={{width:"46vw",marginRight:"2vw"}}>{description&&<h4 style={{marginTop:"0",marginLeft:"0"}}>{description}</h4>}</div>
                  </div>}
                  <hr/>
                  <div style={{marginLeft:"2vw"}}>
                  <input onChange={handleChange}></input><button onClick={search}>Submit Search</button>
                  <div style={{paddingBottom:"0",marginBottom:"0",paddingTop:"0.5vh",marginTop:"0.5vh"}}>
                  {(histor.length>0)&&histor.map((item,index)=><h5 style={{display:"inline",marginTop:"0vh"}}>{item}{(index<histor.length-1)&&<>/ </>}</h5>)}
                  </div>
                  </div>
                  <h2 style={{paddingLeft:"2vw",paddingBottom:"0",marginBottom:"0",paddingTop:"0.5vh",marginTop:"0.5vh"}}>Subcategories of {trunklabellevel}: {trunklabel}</h2>
                  <div style={{paddingLeft:"2vw",marginTop:"0.5vh"}}>
                  {searchlevel&&<button style={{maxWidth:"20vw",display:"inline"}} onClick={upOneLevel}>Up One Level</button>}
                  </div>
                  <div style={{display:"flex",width:"100vw",overflowX:"scroll"}}>

                  {keys&&keys.map((key,index)=><div style={{marginLeft:"2vw",width:"20vw"}}><div>{titleone&&<h3 >{titleone}</h3>}</div><button style={{backgroundColor:colors[index],display:"block"}} onClick={(e) => narrowOptions(e,true)} value={key}>{key.split(": ")[1]}</button>{(Object.keys(taxonom[`${key}`]).length>0)&&<div>{titletwo&&<h4>{titletwo}</h4>}</div>}
                  {taxonom[`${key}`]&&Object.keys(taxonom[`${key}`]).map(item=><button style={{backgroundColor:colors[index],display:"block"}}  onClick={(e) => narrowOptions(e,true,key)} value={item}>{item.split(": ")[1]}</button>)}
                  </div>)}
                  </div>
                  </div>
                  </div></>)
                }
                const areEqual = (prevProps, nextProps) => true;

                export default React.memo(Tree, areEqual);
