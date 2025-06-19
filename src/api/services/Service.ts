/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_create_mount_mounts__post } from '../models/Body_create_mount_mounts__post';
import type { Body_update_mount_mounts__mount_id__put } from '../models/Body_update_mount_mounts__mount_id__put';
import type { Brand } from '../models/Brand';
import type { Camera } from '../models/Camera';
import type { Lens } from '../models/Lens';
import type { Mount } from '../models/Mount';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Service {
    /**
     * 创建品牌
     * 添加一个新的相机品牌到数据库
     * @param requestBody
     * @returns Brand 创建成功的品牌信息
     * @throws ApiError
     */
    public static createBrandBrandsPost(
        requestBody: Brand,
    ): CancelablePromise<Brand> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/brands/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取品牌列表
     * 分页查询所有相机品牌信息
     * @param skip
     * @param limit
     * @param keyword
     * @returns Brand 品牌列表
     * @throws ApiError
     */
    public static readBrandsBrandsGet(
        skip?: (number | null),
        limit?: (number | null),
        keyword?: (string | null),
    ): CancelablePromise<Array<Brand>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/brands/',
            query: {
                'skip': skip,
                'limit': limit,
                'keyword': keyword,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取品牌详情
     * 根据ID查询特定相机品牌信息
     * @param brandId
     * @returns Brand 品牌详细信息
     * @throws ApiError
     */
    public static readBrandBrandsBrandIdGet(
        brandId: number,
    ): CancelablePromise<Brand> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/brands/{brand_id}',
            path: {
                'brand_id': brandId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新品牌信息
     * 根据ID更新相机品牌信息
     * @param brandId
     * @param requestBody
     * @returns Brand 更新后的品牌信息
     * @throws ApiError
     */
    public static updateBrandBrandsBrandIdPut(
        brandId: number,
        requestBody: Brand,
    ): CancelablePromise<Brand> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/brands/{brand_id}',
            path: {
                'brand_id': brandId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除品牌
     * 根据ID删除相机品牌记录
     * @param brandId
     * @returns any 删除操作结果
     * @throws ApiError
     */
    public static deleteBrandBrandsBrandIdDelete(
        brandId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/brands/{brand_id}',
            path: {
                'brand_id': brandId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 用户登录
     * 用户登录接口，返回访问令牌
     * @param requestBody
     * @returns any 访问令牌
     * @throws ApiError
     */
    public static loginUsersLoginPost(
        requestBody: Record<string, any>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 用户注册
     * 新用户注册接口
     * @param requestBody
     * @returns User 注册成功的用户信息
     * @throws ApiError
     */
    public static registerUserUsersRegisterPost(
        requestBody: Record<string, any>,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 创建用户
     * 管理员创建新用户
     * @param requestBody
     * @returns User 创建成功的用户信息
     * @throws ApiError
     */
    public static createUserUsersPost(
        requestBody: User,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取用户列表
     * 分页查询所有用户信息
     * @param skip
     * @param limit
     * @returns User 用户列表
     * @throws ApiError
     */
    public static readUsersUsersGet(
        skip?: (number | null),
        limit?: (number | null),
    ): CancelablePromise<Array<User>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取当前用户信息
     * 获取当前登录用户的详细信息
     * @returns User 当前用户信息
     * @throws ApiError
     */
    public static readCurrentUserUsersMeGet(): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me',
        });
    }
    /**
     * 获取用户详情
     * 根据ID查询特定用户信息
     * @param userId
     * @returns User 用户详细信息
     * @throws ApiError
     */
    public static readUserUsersUserIdGet(
        userId: number,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新用户信息
     * 根据ID更新用户信息
     * @param userId
     * @param requestBody
     * @returns User 更新后的用户信息
     * @throws ApiError
     */
    public static updateUserUsersUserIdPut(
        userId: number,
        requestBody: User,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除用户
     * 根据ID删除用户记录
     * @param userId
     * @returns any 删除操作结果
     * @throws ApiError
     */
    public static deleteUserUsersUserIdDelete(
        userId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 创建相机
     * 添加一个新的相机到数据库
     * @param requestBody
     * @returns Camera 创建成功的相机信息
     * @throws ApiError
     */
    public static createCameraCamerasPost(
        requestBody: Camera,
    ): CancelablePromise<Camera> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cameras/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取相机列表
     * 分页查询所有相机信息
     * @param skip
     * @param limit
     * @param search
     * @returns Camera 相机列表
     * @throws ApiError
     */
    public static readCamerasCamerasGet(
        skip?: (number | null),
        limit?: (number | null),
        search?: (string | null),
    ): CancelablePromise<Array<Camera>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cameras/',
            query: {
                'skip': skip,
                'limit': limit,
                'search': search,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取相机详情
     * 根据ID查询特定相机信息
     * @param cameraId
     * @returns Camera 相机详细信息
     * @throws ApiError
     */
    public static readCameraCamerasCameraIdGet(
        cameraId: number,
    ): CancelablePromise<Camera> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cameras/{camera_id}',
            path: {
                'camera_id': cameraId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新相机信息
     * 根据ID更新相机信息
     * @param cameraId
     * @param requestBody
     * @returns Camera 更新后的相机信息
     * @throws ApiError
     */
    public static updateCameraCamerasCameraIdPut(
        cameraId: number,
        requestBody: Camera,
    ): CancelablePromise<Camera> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/cameras/{camera_id}',
            path: {
                'camera_id': cameraId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除相机
     * 根据ID删除相机记录
     * @param cameraId
     * @returns any 删除操作结果
     * @throws ApiError
     */
    public static deleteCameraCamerasCameraIdDelete(
        cameraId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/cameras/{camera_id}',
            path: {
                'camera_id': cameraId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 创建镜头
     * 添加一个新的镜头到数据库
     * @param requestBody
     * @returns Lens 创建成功的镜头信息
     * @throws ApiError
     */
    public static createLensLensesPost(
        requestBody: Lens,
    ): CancelablePromise<Lens> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/lenses/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取镜头列表
     * 分页查询所有镜头信息
     * @param skip
     * @param limit
     * @returns Lens 镜头列表
     * @throws ApiError
     */
    public static readLensesLensesGet(
        skip?: (number | null),
        limit?: (number | null),
    ): CancelablePromise<Array<Lens>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/lenses/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取镜头详情
     * 根据ID查询特定镜头信息
     * @param lensId
     * @returns Lens 镜头详细信息
     * @throws ApiError
     */
    public static readLensLensesLensIdGet(
        lensId: number,
    ): CancelablePromise<Lens> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/lenses/{lens_id}',
            path: {
                'lens_id': lensId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新镜头信息
     * 根据ID更新镜头信息
     * @param lensId
     * @param requestBody
     * @returns Lens 更新后的镜头信息
     * @throws ApiError
     */
    public static updateLensLensesLensIdPut(
        lensId: number,
        requestBody: Lens,
    ): CancelablePromise<Lens> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/lenses/{lens_id}',
            path: {
                'lens_id': lensId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除镜头
     * 根据ID删除镜头记录
     * @param lensId
     * @returns any 删除操作结果
     * @throws ApiError
     */
    public static deleteLensLensesLensIdDelete(
        lensId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/lenses/{lens_id}',
            path: {
                'lens_id': lensId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 创建卡口
     * 添加一个新的卡口到数据库
     * @param requestBody
     * @returns Mount 创建成功的卡口信息
     * @throws ApiError
     */
    public static createMountMountsPost(
        requestBody: Body_create_mount_mounts__post,
    ): CancelablePromise<Mount> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mounts/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取卡口列表
     * 分页查询所有卡口信息
     * @param skip
     * @param limit
     * @returns Mount 卡口列表
     * @throws ApiError
     */
    public static readMountsMountsGet(
        skip?: (number | null),
        limit?: (number | null),
    ): CancelablePromise<Array<Mount>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mounts/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 获取卡口详情
     * 根据ID查询特定卡口信息
     * @param mountId
     * @returns Mount 卡口详细信息
     * @throws ApiError
     */
    public static readMountMountsMountIdGet(
        mountId: number,
    ): CancelablePromise<Mount> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mounts/{mount_id}',
            path: {
                'mount_id': mountId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 更新卡口信息
     * 根据ID更新卡口信息
     * @param mountId
     * @param requestBody
     * @returns Mount 更新后的卡口信息
     * @throws ApiError
     */
    public static updateMountMountsMountIdPut(
        mountId: number,
        requestBody: Body_update_mount_mounts__mount_id__put,
    ): CancelablePromise<Mount> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/mounts/{mount_id}',
            path: {
                'mount_id': mountId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * 删除卡口
     * 根据ID删除卡口记录
     * @param mountId
     * @returns any 删除操作结果
     * @throws ApiError
     */
    public static deleteMountMountsMountIdDelete(
        mountId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/mounts/{mount_id}',
            path: {
                'mount_id': mountId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
