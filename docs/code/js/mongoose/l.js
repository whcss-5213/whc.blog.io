  async init(categories: CategoryInput[]) {
    // 1. 获取所有待处理的分类名称
    const allNames = categories.map(c => c.name);

    // 2. 一次性查询已存在的分类（只返回名称，减少数据传输）
    const existing = await this.categoryModel.find(
      { name: { $in: allNames } },
      { name: 1, _id: 1 }
    ).lean();

    // 3. 建立已存在名称的 Set
    const existingNames = new Set(existing.map(e => e.name));

    // 4. 分离父分类和子分类，并过滤掉已存在的
    const parentCategories: CategoryInput[] = [];
    const childCategories: CategoryInput[] = [];

    for (const cat of categories) {
      if (!cat.parent) {
        if (!existingNames.has(cat.name)) {
          parentCategories.push(cat);
        }
      } else {
        if (!existingNames.has(cat.name)) {
          childCategories.push(cat);
        }
      }
    }

    // 如果没有新数据，直接返回
    if (parentCategories.length === 0 && childCategories.length === 0) return;


    try {
      // 插入父分类
      const insertedParents = await this.categoryModel.insertMany(parentCategories);

      // 建立父分类名称到 _id 的映射
      const parentNameToId = new Map(
        insertedParents.map(p => [p.name, p._id])
      );

      // 准备子分类数据（将 parent 从名称替换为 ObjectId）
      const childDocs: CategoryDoc[] = [];
      for (const child of childCategories) {
        const parentId = parentNameToId.get(child.parent!);
        if (!parentId) {
          // 如果父分类不在本次插入中，则从数据库查询
          const existingParent = await this.categoryModel.findOne(
            { name: child.parent },
            { _id: 1 },
          ).lean();
          if (!existingParent) {
            throw new Error(`父分类 "${child.parent}" 不存在`);
          }
          childDocs.push({ name: child.name, slug: child.slug, parent: existingParent._id as Types.ObjectId });
        } else {
          childDocs.push({ name: child.name, slug: child.slug, parent: parentId as Types.ObjectId });
        }
      }

      // 插入子分类
      if (childDocs.length > 0) {
        await this.categoryModel.insertMany(childDocs);
      }

    } catch (error) {
      throw error;
    } finally {
    }
  }