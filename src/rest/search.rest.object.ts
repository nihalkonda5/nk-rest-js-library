import RESTObject from './rest.object';
import * as RestOperations from './rest.operations';

export default class SearchRESTObject<T>{

    data:RESTObject<T>;

    request:{
        query:object,
        sort:object,
        attributes:object,
        pageSize:number,
        pageNum:number
    };

    response:{
        query:object,
        sort:object,
        attributes:object,
        pageSize:number,
        pageNum:number,
        pageCount:number,
        resultSize:number,
        resultTotalSize:number,
        result:RESTObject<T>[]
    };

    constructor(data:RESTObject<T>){
        this.data = data;
        this.request = {
            query : {},
            sort : {},
            attributes : [],
            pageNum : 1,
            pageSize : 5
        }
        this.response = {
            query : {},
            sort : {},
            attributes : [],
            pageNum : 1,
            pageSize : 5,
            pageCount : 0,

            resultSize : 0,
            resultTotalSize : 0,

            result : []
        }
    }

    setRequest(request:{query?:object,sort?:object,pageSize?:number,pageNum?:number,attributes?:object} = {}){
        this.request.query = request.query || {};
        this.request.sort = request.sort || {};
        this.request.attributes = request.attributes || [];
        this.request.pageNum = request.pageNum || 1;
        this.request.pageSize = request.pageSize || 5;
        //console.log('setRequest',this.request);
    }

    hasNextPage(){
        if(this.request.pageNum===0)
            return true;
        //console.log(this.request.pageSize,this.response.pageSize,this.request.pageNum,this.response.resultTotalSize);
        if(this.request.pageNum*this.request.pageSize >= this.response.resultTotalSize){
            return false;
        }
        return true;
    }

    async loadNextPage(){
        //console.log('loadNextPage',this.request);
        if(this.hasNextPage() === false)
            return this;
        this.request.pageNum++;
        return await this.search();
    }

    async search(){

        console.log('search',this.data,this.request);

        const result = ((await RestOperations.postOp(
            this.data.overloadables.formulateSearchUrl(this.request.pageSize,this.request.pageNum)
            ,this.request
            )).data)



        let pageCount = ((result.resultTotalSize/result.pageSize)+(result.resultTotalSize%result.pageSize===0?0:1));

        pageCount = isNaN(pageCount)?0:pageCount;

        pageCount = parseInt(`${pageCount}`);

        this.response = {
            query : result.query,
            sort : result.sort,
            attributes : result.attributes,
            pageNum : result.pageNum,
            pageSize : result.pageSize,
            pageCount : pageCount,

            resultSize : result.resultSize,
            resultTotalSize : result.resultTotalSize,

            result : []
        }



        for (const r of result.result) {
            const r1 = this.data.overloadables.newInstance();
            //console.log(r1,r1.read,r1.overloadables,r1.overloadables.formulateReadUrl());
            r1.overloadables.loadPartialContent(r);
            //console.log(r["_id"],r1.data["_id"],r1.data["createdAt"]);
            this.response.result.push(r1);
            //this.response.result.forEach((item)=>console.log(item.data["_id"],item.overloadables.formulateReadUrl()));
        }

        //console.log(this.response.result);
    }

}