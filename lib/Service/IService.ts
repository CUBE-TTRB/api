export default interface IService{
    call() : Promise<this>;
    errors : string[];
}
