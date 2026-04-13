import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../../utils/constants';
import { VacantGet } from '@admin/interfaces/vacants/vacantget.interface';
import { VacantPost } from '@admin/interfaces/vacants/vacantpost.interface';
import { PaginatedResponse } from '@shared/interfaces/paginated-response.interface';


@Injectable({providedIn: 'root'})
export class  VacantService {

    constructor(private _http: HttpClient) { }

    public GetAllVacants(page: number, pageSize: number)
        : Observable<PaginatedResponse<VacantGet> | VacantGet[]> 
    {
        return this._http.get<PaginatedResponse<VacantGet> | VacantGet[]>(`${BASE_URL}/Vacants`, {
            params: {
                page: page,
                pageSize: pageSize
            }
        });
    }

    public GetVacantsById(id: string, page: number, pageSize: number)
        : Observable<PaginatedResponse<VacantGet> | VacantGet> 
    {
        return this._http.get<PaginatedResponse<VacantGet> | VacantGet>(`${BASE_URL}/Vacants/${id}`);
    }

    public CreateVacant(vacant: VacantPost): Observable<VacantGet> {
        return this._http.post<VacantGet>(`${BASE_URL}/Vacants`, vacant);
    }

    public EditVacant(id: string, vacant: VacantPost): Observable<VacantGet> {
        return this._http.put<VacantGet>(`${BASE_URL}/Vacants/${id}`, vacant);
    }

    public DeleteVacant(id: string): Observable<void> {
        return this._http.delete<void>(`${BASE_URL}/Vacants/${id}`);
    }

}